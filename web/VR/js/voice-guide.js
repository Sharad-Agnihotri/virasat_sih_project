// ============================================================
// voice-guide.js — Pro-Grade Audio Guide Controller
// Uses Web Speech API with premium voice selection and
// pacing adjustments to mimic a museum docent.
// ============================================================

class VoiceGuide {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.isEnabled = false;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.onStateChange = null; // callback(isSpeaking)
    this._run = 0;             // bumps on every speak()/stop() to orphan old utterances
    this._kick = null;
    
    // Attempt to load voices (browsers load them asynchronously)
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this._selectBestVoice();
    }
    
    setTimeout(() => this._selectBestVoice(), 500);
  }

  // Find the most professional sounding voice available for a specific language
  _selectBestVoice(langCode = 'en') {
    const voices = this.synth.getVoices();
    if (voices.length === 0) return;

    // Reset voice
    this.voice = null;

    if (langCode === 'hi') {
      // Look for Hindi voices
      const hiVoices = voices.filter(v => v.lang.startsWith('hi'));
      
      // Preferred Hindi voices (often female voices sound more like docents)
      this.voice = hiVoices.find(v => v.name.toLowerCase().includes('female')) || hiVoices[0];
      
      if (this.voice) {
        console.log('🎙️ Selected Pro Hindi Voice:', this.voice.name);
        return;
      }
    }

    // Default to English
    const preferredNames = [
      'Google UK English Female',
      'Google US English',
      'Microsoft Aria',
      'Microsoft Sonia',
      'Samantha', // macOS
      'Daniel'    // macOS
    ];

    for (const name of preferredNames) {
      const match = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
      if (match) {
        this.voice = match;
        console.log('🎙️ Selected Pro English Voice:', this.voice.name);
        return;
      }
    }

    // Fallback
    this.voice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) 
              || voices.find(v => v.lang.startsWith('en')) 
              || voices[0];
  }

  // Pre-process text to make the speech sound more natural (museum docent style)
  _formatTextForSpeech(text) {
    if (!text) return "";
    // Add micro-pauses by replacing dashes and ellipses with commas
    let formatted = text.replace(/ — /g, ', ');
    formatted = formatted.replace(/\.\.\./g, ', ');
    // Remove emojis which can confuse some screen readers
    formatted = formatted.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''); 
    return formatted;
  }

  // Read a text block
  speak(text) {
    if (!this.isEnabled) return;

    this.stop(); // Stop anything currently playing

    const formattedText = this._formatTextForSpeech(text);
    if (!formattedText) return;

    // Mobile engines (Android Chrome especially) stop mid-way through long
    // utterances, so narrate sentence by sentence.
    const parts = (formattedText.match(/[^.!?।]+[.!?।]*\s*/g) || [formattedText])
      .map(p => p.trim()).filter(Boolean);
    const run = ++this._run;
    let queued = 0;

    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      if (this.voice) { u.voice = this.voice; u.lang = this.voice.lang; }
      else u.lang = (typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'hi') ? 'hi-IN' : 'en-IN';
      u.rate = 0.9;  // Slightly slower for documentary feel
      u.pitch = 0.95; // Slightly deeper

      u.onstart = () => {
        if (run !== this._run) return;
        this.currentUtterance = u;
        if (!this.isSpeaking) {
          this.isSpeaking = true;
          if (this.onStateChange) this.onStateChange(true);
        }
      };
      const finish = () => {
        if (run !== this._run) return;
        queued--;
        if (queued > 0) return;
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (this.onStateChange) this.onStateChange(false);
      };
      u.onend = finish;
      u.onerror = (e) => { console.warn('Speech synthesis error:', e); finish(); };
      queued++;
      this.synth.speak(u);
    });

    // Android Chrome pauses synthesis it thinks is stuck; nudge it along.
    if (/android/i.test(navigator.userAgent)) {
      clearInterval(this._kick);
      this._kick = setInterval(() => {
        if (run !== this._run || !this.synth.speaking) { clearInterval(this._kick); return; }
        this.synth.pause(); this.synth.resume();
      }, 8000);
    }
  }

  // Stop current speech
  stop() {
    this._run++;
    clearInterval(this._kick);
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    if (this.onStateChange) this.onStateChange(false);
  }

  // Toggle the voice guide system entirely
  toggleSystem() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    } else {
      // app.js narrates the current viewpoint right after enabling, so
      // there is no separate "activated" line.
      this._selectBestVoice(typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en');
    }
    return this.isEnabled;
  }
}

// Singleton
const voiceGuide = new VoiceGuide();

// Listen for language changes from i18n.js
document.addEventListener('languageChanged', (e) => {
  const newLang = e.detail.language;
  voiceGuide._selectBestVoice(newLang);
  
  // If speaking, stop and maybe restart in new language? (Keep it simple: just stop)
  if (voiceGuide.isSpeaking) {
    voiceGuide.stop();
  }
});
