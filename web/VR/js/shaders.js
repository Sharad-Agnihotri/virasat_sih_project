// ============================================================
// shaders.js — Chronos Lens (time-travel) sky shader
//
// Renders the present-day panorama and its period-photograph
// counterpart on the same sphere, and wipes between them with an
// expanding circular wavefront centred on wherever the visitor is
// looking when they flip the switch — so the past arrives around
// them rather than the picture simply changing.
//
// COLOUR: three.js applies no automatic output conversion to a
// ShaderMaterial. The old version sampled hardware-sRGB-decoded
// (i.e. linear) texels and wrote them straight to the framebuffer
// with no re-encode, which is exactly why switching the lens on
// looked like someone had dimmed the picture. panorama.js therefore
// uploads both textures with NoColorSpace, so texture2D() returns the
// stored sRGB values, everything here works in that same space, and
// what we write is what the display expects. Keep it that way: if the
// textures are ever marked sRGB again, this shader must gain a
// linear->sRGB encode on output.
// ============================================================

AFRAME.registerShader('chronos-lens', {
  schema: {
    src:      { type: 'map',    is: 'uniform' },   // present day
    pastSrc:  { type: 'map',    is: 'uniform' },   // aged plate
    reveal:   { type: 'number', is: 'uniform', default: 0.0 },  // 0 = now, 1 = fully past
    feather:  { type: 'number', is: 'uniform', default: 0.13 }, // wavefront softness (radians)
    center:   { type: 'vec3',   is: 'uniform', default: { x: 0, y: 0, z: -1 } },
    ringGlow: { type: 'number', is: 'uniform', default: 1.0 },
    grade:    { type: 'number', is: 'uniform', default: 1.0 }   // present-day punch, 0 disables
  },

  vertexShader: `
    varying vec3 vWorldPosition;
    varying vec2 vUV;

    void main() {
      vUV = uv;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D src;
    uniform sampler2D pastSrc;
    uniform float reveal;
    uniform float feather;
    uniform vec3  center;
    uniform float ringGlow;
    uniform float grade;

    varying vec3 vWorldPosition;
    varying vec2 vUV;

    const float PI = 3.14159265359;

    // The clarity grade that used to be a CSS filter over the whole canvas —
    // a full-screen composite pass every frame. Free here, and the constants
    // match the filter it replaces: saturate(1.2) contrast(1.15) brightness(1.05).
    vec3 applyGrade(vec3 c) {
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(l), c, 1.20);
      c = (c - 0.5) * 1.15 + 0.5;
      return c * 1.05;
    }

    void main() {
      // Present day is the overwhelmingly common case, and the wavefront maths
      // below costs an acos, an exp and a normalize on every pixel of a
      // full-screen sky. Skip all of it unless the lens is actually moving.
      if (reveal < 0.001) {
        vec3 c = texture2D(src, vUV).rgb;
        gl_FragColor = vec4(mix(c, applyGrade(c), grade), 1.0);
        return;
      }
      if (reveal > 0.999) {
        gl_FragColor = vec4(texture2D(pastSrc, vUV).rgb, 1.0);
        return;
      }

      vec3 present = texture2D(src, vUV).rgb;
      vec3 past    = texture2D(pastSrc, vUV).rgb;

      present = mix(present, applyGrade(present), grade);

      // Angle between this fragment's direction and the reveal centre.
      float ang = acos(clamp(dot(normalize(vWorldPosition), normalize(center)), -1.0, 1.0));

      // Drive the wavefront a little past PI so the far pole finishes cleanly.
      float edge = reveal * (PI + 0.4);
      float m = 1.0 - smoothstep(edge - feather, edge + feather, ang);

      vec3 color = mix(present, past, m);

      // Gold wavefront, faded in at the start and out as it closes.
      float t = (ang - edge) / max(feather * 1.15, 0.001);
      float band = exp(-t * t);
      float travelling = smoothstep(0.0, 0.05, reveal) * (1.0 - smoothstep(0.90, 1.0, reveal));
      color += vec3(0.85, 0.62, 0.22) * band * travelling * ringGlow;

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `
});
