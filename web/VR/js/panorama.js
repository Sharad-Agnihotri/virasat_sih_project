// ============================================================
// panorama.js — A-Frame Panorama Management
// Controls the 360° panoramic viewer, transitions,
// camera/zoom, auto-rotation, and the Chronos Lens time travel.
// ============================================================

/* Present-day panoramas ship as <name>_panorama.png; their aged
   period-photograph counterparts are generated alongside them as
   <name>_panorama_past.jpg. Viewpoint data may override this with an
   explicit `pastPanorama` (e.g. a real archival photograph). */
function derivePastUrl(url) {
  if (!url) return null;
  return url.replace(/_panorama\.(png|jpg|jpeg|webp)$/i, '_panorama_past.webp');
}

class PanoramaManager {
  constructor() {
    this.scene = null;
    this.sky = null;
    this.camera = null;

    this.currentFOV = 80;
    this.targetFOV = 80;
    this.minFOV = 30;
    this.maxFOV = 110;

    this.isTransitioning = false;
    this.autoRotateSpeed = 1.2;          // degrees per second
    this.autoRotateEnabled = true;
    this.autoRotateTimer = null;
    this.idleTimeout = 5000;
    this.isAutoRotating = false;

    this.isTimeTravelActive = false;
    this.onReady = null;
    this.onTimeTravelProgress = null;    // callback(0..1)
    this.isReady = false;

    this._textureCache = new Map();
    this._material = null;
    this._rafId = null;
    this._lastFrameTime = 0;
    this._idleRaf = 0;

    // Programmatic camera aim (arrow buttons / keys). This is only ever
    // consulted while _aimPending is true. look-controls owns the camera the
    // rest of the time — see the render loop for why that matters.
    this._targetYaw = 0;
    this._targetPitch = 0;
    this._aimPending = false;
    this._userDragging = false;

    this._reveal = 0;
    this._revealTarget = 0;
  }

  init() {
    this.scene = document.querySelector('a-scene');
    this.sky = document.getElementById('panorama-sky');
    this.camera = document.getElementById('main-camera');

    if (!this.scene) {
      console.error('A-Frame scene not found');
      return;
    }

    if (this.scene.hasLoaded) this._onSceneReady();
    else this.scene.addEventListener('loaded', () => this._onSceneReady());

    this._setupZoomControls();
    this._setupIdleTracking();
  }

  _onSceneReady() {
    this.isReady = true;
    this._ensureMaterial();
    this._startLoop();
    if (this.onReady) this.onReady();
  }

  /* ── Material ───────────────────────────────────────────────────────────
     The Chronos shader is installed once and never swapped. Swapping the
     material on toggle forced a shader recompile mid-interaction, which is
     what made switching to "past" hitch. From here on we only write
     uniforms. */
  _ensureMaterial() {
    if (this._material || !this.sky) return this._material;

    this.sky.setAttribute('material', {
      shader: 'chronos-lens',
      reveal: 0,
      grade: 1
    });

    const mesh = this.sky.getObject3D('mesh');
    if (mesh && mesh.material) {
      this._material = mesh.material;
      // The sky sphere is rendered from the inside.
      this._material.side = THREE.BackSide;
      this._material.needsUpdate = true;
    }
    return this._material;
  }

  _uniforms() {
    if (!this._material) this._ensureMaterial();
    return this._material ? this._material.uniforms : null;
  }

  /* ── Texture loading ──────────────────────────────────────────────────── */
  _loadTexture(url) {
    if (!url) return Promise.resolve(null);
    if (this._textureCache.has(url)) return this._textureCache.get(url);

    const promise = new Promise((resolve) => {
      const loader = new THREE.TextureLoader();
      if (/^https?:\/\//i.test(url)) loader.setCrossOrigin('anonymous');

      loader.load(
        url,
        (texture) => {
          // No sRGB decode: the shader works directly in the stored colour
          // space and writes what the display expects. three.js does not
          // re-encode a ShaderMaterial's output, so decoding here without a
          // matching encode in the shader is what made the sky look dim.
          if ('colorSpace' in texture) texture.colorSpace = THREE.NoColorSpace;
          else if ('encoding' in texture) texture.encoding = THREE.LinearEncoding;

          texture.wrapS = THREE.RepeatWrapping;      // seamless 360° wrap
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;

          const renderer = this.scene && this.scene.renderer;
          if (renderer) {
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          }
          texture.needsUpdate = true;
          resolve(texture);
        },
        undefined,
        () => {
          console.warn('Panorama texture failed to load:', url);
          this._textureCache.delete(url);
          resolve(null);
        }
      );
    });

    this._textureCache.set(url, promise);
    return promise;
  }

  /* Fetch + decode a panorama ahead of time (no visual change). */
  preload(imageUrl) {
    if (!imageUrl) return;
    this._loadTexture(imageUrl);
    this._loadTexture(derivePastUrl(imageUrl));
  }

  /* Load a panorama (and its past counterpart) with a fade transition. */
  loadPanorama(imageUrl, rotation = '0 0 0', callback, pastUrlOverride) {
    const pastUrl = pastUrlOverride || derivePastUrl(imageUrl);
    const transitionEl = document.getElementById('panorama-transition');

    // A newer request supersedes an in-flight one rather than being dropped,
    // so rapid monument switching can't leave the view stuck on the old scene.
    const requestId = (this._requestId = (this._requestId || 0) + 1);

    this.isTransitioning = true;
    this.stopAutoRotate();
    if (transitionEl) transitionEl.classList.add('active');

    // Only the present-day plate gates the reveal. The archival plate is
    // just the shader's second layer, so it streams in afterwards.
    const presentLoaded = this._loadTexture(imageUrl);
    const pastLoaded = this._loadTexture(pastUrl);

    // Fade-out and decode overlap instead of running back to back. A first
    // load (nothing on screen yet) skips the fade entirely.
    const fadeDone = new Promise(resolve => setTimeout(resolve, this._hasShown ? 380 : 0));

    Promise.all([presentLoaded, fadeDone]).then(([present]) => {
      if (requestId !== this._requestId) return;   // superseded

      const u = this._uniforms();
      if (u && present) {
        if (u.src) u.src.value = present;
        if (u.pastSrc) u.pastSrc.value = present;
        this._material.needsUpdate = true;
        this._hasShown = true;
        pastLoaded.then(past => {
          if (requestId !== this._requestId || !past || !u.pastSrc) return;
          u.pastSrc.value = past;
          this._material.needsUpdate = true;
        });
      }

      if (rotation && this.sky) this.sky.setAttribute('rotation', rotation);

      requestAnimationFrame(() => {
        if (requestId !== this._requestId) return;
        if (transitionEl) transitionEl.classList.remove('active');
        this.isTransitioning = false;
        this.resetIdleTimer();
        if (callback) callback();
      });
    });
  }

  /* ── Zoom ─────────────────────────────────────────────────────────────── */
  _setupZoomControls() {
    const sceneEl = document.querySelector('.a-scene-container') || document.querySelector('a-scene');
    if (!sceneEl) return;

    sceneEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      // Proportional to the actual wheel delta, so trackpads glide instead of
      // jumping in fixed 3° steps.
      this.zoom(Math.max(-8, Math.min(8, e.deltaY * 0.05)));
      this.resetIdleTimer();
    }, { passive: false });

    let lastTouchDistance = 0;
    sceneEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) lastTouchDistance = this._getTouchDistance(e.touches);
      this.resetIdleTimer();
    }, { passive: true });

    sceneEl.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const dist = this._getTouchDistance(e.touches);
        if (lastTouchDistance > 0) this.zoom((lastTouchDistance - dist) * 0.08);
        lastTouchDistance = dist;
      }
      this.resetIdleTimer();
    }, { passive: true });

    sceneEl.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) lastTouchDistance = 0;
    }, { passive: true });
  }

  _getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Zoom sets a target; the render loop eases toward it.
  zoom(delta) {
    this.targetFOV = Math.max(this.minFOV, Math.min(this.maxFOV, this.targetFOV + delta));
  }

  zoomIn()  { this.zoom(-8); this.resetIdleTimer(); }
  zoomOut() { this.zoom(8);  this.resetIdleTimer(); }
  resetZoom() { this.targetFOV = 80; this.resetIdleTimer(); }

  /* ── Camera aim ───────────────────────────────────────────────────────── */
  _lookControls() {
    if (!this.camera) return null;
    return this.camera.components && this.camera.components['look-controls'];
  }

  /* Arrow buttons and keys nudge a target the loop eases toward.
     Previously these rotated the sky itself, which tilted the horizon on
     up/down and fought against look-controls on left/right. */
  rotateCamera(direction) {
    const lc = this._lookControls();
    if (!lc || !lc.yawObject) return;

    // Always re-anchor to where the camera actually is. Carrying a target
    // across an intervening mouse drag is what made the view snap backwards.
    if (!this._aimPending) {
      this._targetYaw = lc.yawObject.rotation.y;
      this._targetPitch = lc.pitchObject.rotation.x;
    }

    const yawStep = THREE.MathUtils.degToRad(28);
    const pitchStep = THREE.MathUtils.degToRad(16);
    const pitchLimit = THREE.MathUtils.degToRad(75);

    switch (direction) {
      case 'left':  this._targetYaw += yawStep; break;
      case 'right': this._targetYaw -= yawStep; break;
      case 'up':    this._targetPitch = Math.min(this._targetPitch + pitchStep, pitchLimit); break;
      case 'down':  this._targetPitch = Math.max(this._targetPitch - pitchStep, -pitchLimit); break;
    }
    this._aimPending = true;
    this.resetIdleTimer();
  }

  /* ── Idle / auto-rotate ───────────────────────────────────────────────── */
  _setupIdleTracking() {
    // Pointer movement fires continuously; rebuilding a timeout on every event
    // was a measurable share of the drag-time jank. Coalesce to one flag that
    // the render loop consumes.
    const mark = () => { this._idleDirty = true; };
    ['mousedown', 'mousemove', 'touchstart', 'touchmove', 'wheel', 'keydown']
      .forEach(evt => document.addEventListener(evt, mark, { passive: true }));

    // While the visitor is dragging, look-controls owns the camera outright.
    // If we also write yaw/pitch during a drag the two writers fight over the
    // same values every frame and the view sticks and springs back under the
    // cursor. Hand over ownership on press, take it back on release.
    const grab = () => {
      this._userDragging = true;
      this._aimPending = false;      // drop any half-finished button nudge
      this.stopAutoRotate();
    };
    const release = () => { this._userDragging = false; };

    ['pointerdown', 'mousedown', 'touchstart']
      .forEach(evt => document.addEventListener(evt, grab, { passive: true }));
    ['pointerup', 'pointercancel', 'mouseup', 'touchend', 'touchcancel']
      .forEach(evt => document.addEventListener(evt, release, { passive: true }));
    // A pointer released outside the window never reports up.
    window.addEventListener('blur', release);
  }

  resetIdleTimer() {
    this.stopAutoRotate();
    clearTimeout(this.autoRotateTimer);
    if (this.autoRotateEnabled) {
      this.autoRotateTimer = setTimeout(() => this.startAutoRotate(), this.idleTimeout);
    }
  }

  startAutoRotate() {
    if (this.isTransitioning || this._userDragging) return;
    this.isAutoRotating = true;
  }

  stopAutoRotate() {
    this.isAutoRotating = false;
  }

  /* ── Time travel (Chronos Lens) ───────────────────────────────────────── */
  toggleTimeTravel() {
    this.setTimeTravel(!this.isTimeTravelActive);
    return this.isTimeTravelActive;
  }

  setTimeTravel(active) {
    this.isTimeTravelActive = active;
    const u = this._uniforms();
    if (!u) return;

    // Centre the wavefront on whatever the visitor is currently looking at,
    // so the past sweeps outward from their gaze.
    if (u.center) {
      const camObj = this.camera && this.camera.getObject3D('camera');
      if (camObj) {
        const dir = new THREE.Vector3();
        camObj.getWorldDirection(dir);
        if (dir.lengthSq() > 0) {
          dir.normalize();
          const target = u.center.value;
          if (target && typeof target.copy === 'function') target.copy(dir);
          else u.center.value = dir;
        }
      }
    }

    this._revealTarget = active ? 1 : 0;
  }

  /* ── Single render loop ───────────────────────────────────────────────── */
  _startLoop() {
    if (this._rafId) return;

    const step = (now) => {
      this._rafId = requestAnimationFrame(step);

      const dt = this._lastFrameTime ? Math.min((now - this._lastFrameTime) / 1000, 0.1) : 0.016;
      this._lastFrameTime = now;

      if (this._idleDirty) {
        this._idleDirty = false;
        this.resetIdleTimer();
      }

      // Frame-rate independent easing: same feel at 30, 60 or 144 Hz.
      const ease = (rate) => 1 - Math.pow(1 - rate, dt * 60);

      // Zoom
      if (Math.abs(this.targetFOV - this.currentFOV) > 0.01) {
        this.currentFOV += (this.targetFOV - this.currentFOV) * ease(0.18);
        const camObj = this.camera && this.camera.getObject3D('camera');
        if (camObj) {
          camObj.fov = this.currentFOV;
          camObj.updateProjectionMatrix();
        }
      }

      // Camera aim. Exactly one writer per frame: look-controls while the
      // visitor drags, us otherwise — never both.
      const lc = this._lookControls();
      if (lc && lc.yawObject && !this._userDragging) {
        if (this.isAutoRotating) {
          // Applied directly rather than chased through a target, so the drift
          // is perfectly even instead of always lagging behind by one ease.
          lc.yawObject.rotation.y += THREE.MathUtils.degToRad(this.autoRotateSpeed) * dt;
        } else if (this._aimPending) {
          const dy = this._targetYaw - lc.yawObject.rotation.y;
          const dp = this._targetPitch - lc.pitchObject.rotation.x;
          if (Math.abs(dy) < 1e-4 && Math.abs(dp) < 1e-4) {
            this._aimPending = false;
          } else {
            lc.yawObject.rotation.y += dy * ease(0.16);
            lc.pitchObject.rotation.x += dp * ease(0.16);
          }
        }
      }

      // Chronos reveal
      if (Math.abs(this._revealTarget - this._reveal) > 0.0005) {
        this._reveal += (this._revealTarget - this._reveal) * ease(0.055);
        if (Math.abs(this._revealTarget - this._reveal) <= 0.0005) this._reveal = this._revealTarget;

        const u = this._uniforms();
        if (u && u.reveal) u.reveal.value = this._reveal;
        // Ease the present-day grade out as the past takes over — the aged
        // plate carries its own tone and should not be re-punched.
        if (u && u.grade) u.grade.value = 1 - this._reveal;
        if (this.onTimeTravelProgress) this.onTimeTravelProgress(this._reveal);
      }
    };

    this._rafId = requestAnimationFrame(step);
  }

  destroy() {
    this.stopAutoRotate();
    clearTimeout(this.autoRotateTimer);
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }
}

// Singleton
const panoramaManager = new PanoramaManager();
