/* ==========================================================================
   VIRASAT IMAGE PICKER — "Browse from device" for any image field
   --------------------------------------------------------------------------
   Posts and product listings are kept in localStorage, which browsers cap at
   roughly 5 MB per site. A single phone photo can be 4–8 MB, so an unscaled
   upload would fill the quota with one post and silently lose everything
   after it. This helper reads the chosen file, scales it down to a sensible
   display size, re-encodes it as JPEG, and returns a compact data URL.

   Usage:
     VirasatImagePicker.attach({
       input:   fileInputEl,           // <input type="file">
       onImage: dataUrl => { ... },    // called with the resized image
       maxEdge: 1280, quality: 0.82    // optional
     });
   ========================================================================== */
(function () {
  'use strict';

  function readAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = function () { reject(new Error('Could not read the file.')); };
      r.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('That file is not an image the browser can open.')); };
      img.src = src;
    });
  }

  /* Scale so the longer edge is at most maxEdge, and re-encode as JPEG. PNG
     screenshots with transparency get a white ground rather than black. */
  function shrink(file, opts) {
    opts = opts || {};
    var maxEdge = opts.maxEdge || 1280;
    var quality = opts.quality || 0.82;

    return readAsDataUrl(file).then(loadImage).then(function (img) {
      var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
      if (!w || !h) throw new Error('Image has no size.');
      var scale = Math.min(1, maxEdge / Math.max(w, h));
      var cw = Math.round(w * scale), ch = Math.round(h * scale);

      var canvas = document.createElement('canvas');
      canvas.width = cw; canvas.height = ch;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, cw, ch);

      var out = canvas.toDataURL('image/jpeg', quality);
      // If the source was already small and the JPEG came out larger, keep the original.
      if (scale === 1 && file.size < out.length * 0.75 && /^image\/(jpeg|png|webp)$/.test(file.type)) {
        return readAsDataUrl(file);
      }
      return out;
    });
  }

  function attach(cfg) {
    var input = cfg.input;
    if (!input) return;
    input.setAttribute('accept', 'image/*');
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) {
        if (cfg.onError) cfg.onError('Please choose an image file (JPG, PNG, WebP).');
        input.value = '';
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        if (cfg.onError) cfg.onError('That image is over 25 MB — please choose a smaller one.');
        input.value = '';
        return;
      }
      if (cfg.onStart) cfg.onStart(file);
      shrink(file, cfg).then(function (dataUrl) {
        if (cfg.onImage) cfg.onImage(dataUrl, file);
      }).catch(function (err) {
        if (cfg.onError) cfg.onError(err.message || 'Could not load that image.');
      }).then(function () {
        input.value = '';       // allow picking the same file again
      });
    });
  }

  window.VirasatImagePicker = { attach: attach, shrink: shrink };
})();
