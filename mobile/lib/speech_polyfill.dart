/// Web Speech API shim injected into every page.
///
/// Android's WebView ships neither `speechSynthesis` nor `SpeechRecognition`,
/// so the Virasat guide, the VR narrator and the language studio are silent
/// inside the app. This installs both objects with the same surface the
/// pages already use and forwards the work to Flutter over a JavaScript
/// channel (`VirasatNative`). Flutter answers by calling
/// `window.__virasat.emit(...)`.
///
/// Idempotent: safe to run on every navigation.
const String kSpeechPolyfillJs = r'''
(function () {
  if (window.__virasat) return;
  var post = function (msg) {
    try { VirasatNative.postMessage(JSON.stringify(msg)); } catch (e) {}
  };

  /* ── speechSynthesis ─────────────────────────────────────────────── */
  var seq = 0, queue = [], current = null, paused = false, listeners = {};

  function Utterance(text) {
    this.text = text == null ? '' : String(text);
    this.lang = ''; this.voice = null; this.rate = 1; this.pitch = 1; this.volume = 1;
    this.onstart = this.onend = this.onerror = this.onpause = this.onresume = null;
    this._id = ++seq;
    this._l = {};
  }
  Utterance.prototype.addEventListener = function (t, f) { (this._l[t] = this._l[t] || []).push(f); };
  Utterance.prototype.removeEventListener = function (t, f) {
    var a = this._l[t]; if (!a) return; var i = a.indexOf(f); if (i >= 0) a.splice(i, 1);
  };
  function fire(u, type, extra) {
    var ev = { type: type, utterance: u, charIndex: 0, elapsedTime: 0, name: '' };
    if (extra) for (var k in extra) ev[k] = extra[k];
    try { if (typeof u['on' + type] === 'function') u['on' + type](ev); } catch (e) {}
    (u._l[type] || []).forEach(function (f) { try { f(ev); } catch (e) {} });
  }

  var VOICES = [
    { name: 'Virasat Guide (India)', lang: 'en-IN', voiceURI: 'native:en-IN', localService: true, default: true },
    { name: 'Virasat Guide (Hindi)', lang: 'hi-IN', voiceURI: 'native:hi-IN', localService: true, default: false },
    { name: 'Virasat Guide (US)',    lang: 'en-US', voiceURI: 'native:en-US', localService: true, default: false }
  ];

  function pump() {
    if (current || paused || !queue.length) return;
    current = queue.shift();
    var lang = current.lang || (current.voice && current.voice.lang) || 'en-IN';
    post({ type: 'tts.speak', id: current._id, text: current.text, lang: lang,
           rate: current.rate, pitch: current.pitch, volume: current.volume });
  }

  var synth = {
    get speaking() { return !!current; },
    get pending()  { return queue.length > 0; },
    get paused()   { return paused; },
    onvoiceschanged: null,
    speak: function (u) {
      if (!u || !(u instanceof Utterance)) u = new Utterance(u && u.text);
      if (!u.text.trim()) { setTimeout(function () { fire(u, 'end'); }, 0); return; }
      queue.push(u); pump();
    },
    cancel: function () {
      var dropped = queue; queue = [];
      var c = current; current = null; paused = false;
      post({ type: 'tts.stop' });
      dropped.forEach(function (u) { fire(u, 'error', { error: 'interrupted' }); });
      if (c) fire(c, 'error', { error: 'interrupted' });
    },
    pause:  function () { if (current) { paused = true; post({ type: 'tts.pause' }); fire(current, 'pause'); } },
    resume: function () { if (paused) { paused = false; post({ type: 'tts.resume' }); if (current) fire(current, 'resume'); else pump(); } },
    getVoices: function () { return VOICES.slice(); },
    addEventListener: function (t, f) { (listeners[t] = listeners[t] || []).push(f); },
    removeEventListener: function (t, f) { var a = listeners[t]; if (!a) return; var i = a.indexOf(f); if (i >= 0) a.splice(i, 1); },
    dispatchEvent: function () { return true; }
  };

  /* ── SpeechRecognition ───────────────────────────────────────────── */
  var activeRec = null;
  function Recognition() {
    this.lang = 'en-IN'; this.continuous = false; this.interimResults = false; this.maxAlternatives = 1;
    this.onstart = this.onresult = this.onend = this.onerror = this.onaudiostart = this.onaudioend =
      this.onspeechstart = this.onspeechend = this.onnomatch = null;
  }
  function recFire(r, type, ev) {
    ev = ev || {}; ev.type = type;
    try { if (typeof r['on' + type] === 'function') r['on' + type](ev); } catch (e) {}
  }
  Recognition.prototype.start = function () {
    if (activeRec && activeRec !== this) { try { activeRec.abort(); } catch (e) {} }
    activeRec = this;
    post({ type: 'stt.start', lang: this.lang, interim: !!this.interimResults, continuous: !!this.continuous });
  };
  Recognition.prototype.stop  = function () { post({ type: 'stt.stop' }); };
  Recognition.prototype.abort = function () { post({ type: 'stt.cancel' }); };
  Recognition.prototype.addEventListener = function (t, f) { this['on' + t] = f; };

  function resultEvent(text, isFinal) {
    var alt = { transcript: text, confidence: isFinal ? 0.9 : 0.5 };
    var res = [alt]; res.isFinal = isFinal; res.length = 1; res.item = function () { return alt; };
    var list = [res]; list.length = 1; list.item = function () { return res; };
    return { resultIndex: 0, results: list };
  }

  /* ── Messages from Flutter ───────────────────────────────────────── */
  window.__virasat = {
    emit: function (msg) {
      var u;
      switch (msg.type) {
        case 'tts.start':
          if (current && current._id === msg.id) fire(current, 'start');
          break;
        case 'tts.end':
          if (current && current._id === msg.id) { u = current; current = null; fire(u, 'end'); pump(); }
          break;
        case 'tts.error':
          if (current && current._id === msg.id) { u = current; current = null; fire(u, 'error', { error: msg.error || 'synthesis-failed' }); pump(); }
          break;
        case 'stt.start':  if (activeRec) { recFire(activeRec, 'start'); recFire(activeRec, 'audiostart'); } break;
        case 'stt.result': if (activeRec) recFire(activeRec, 'result', resultEvent(msg.text || '', !!msg.final)); break;
        case 'stt.error':  if (activeRec) recFire(activeRec, 'error', { error: msg.error || 'no-speech', message: msg.error || '' }); break;
        case 'stt.end':    if (activeRec) { var r = activeRec; activeRec = null; recFire(r, 'audioend'); recFire(r, 'end'); } break;
      }
    }
  };

  window.speechSynthesis = synth;
  window.SpeechSynthesisUtterance = Utterance;
  window.SpeechRecognition = window.webkitSpeechRecognition = Recognition;
  window.SpeechSynthesisEvent = function () {};
  setTimeout(function () {
    (listeners.voiceschanged || []).forEach(function (f) { try { f({ type: 'voiceschanged' }); } catch (e) {} });
    try { if (typeof synth.onvoiceschanged === 'function') synth.onvoiceschanged({ type: 'voiceschanged' }); } catch (e) {}
  }, 0);
})();
''';
