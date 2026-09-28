// ============================================================
// audio.js — Ambient Audio Controller
// Generates ambient soundscapes using Web Audio API
// No external audio files needed
// ============================================================

class AmbientAudioController {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.3;
    this.activeNodes = [];
    this.currentMonument = null;
    
    // Sound profiles per monument
    this.soundProfiles = {
      'taj-mahal': {
        type: 'peaceful',
        layers: [
          { type: 'wind', frequency: 200, gain: 0.08 },
          { type: 'birds', baseFreq: 2000, gain: 0.04 },
          { type: 'water', gain: 0.06 },
          { type: 'chimes', baseFreq: 800, gain: 0.02 }
        ]
      },
      'hampi': {
        type: 'ancient',
        layers: [
          { type: 'wind', frequency: 150, gain: 0.1 },
          { type: 'birds', baseFreq: 2200, gain: 0.05 },
          { type: 'stones', gain: 0.02 }
        ]
      },
      'mysore-palace': {
        type: 'royal',
        layers: [
          { type: 'wind', frequency: 180, gain: 0.08 },
          { type: 'chimes', baseFreq: 600, gain: 0.04 },
          { type: 'crowd', gain: 0.03 }
        ]
      },
      'gateway-of-india': {
        type: 'sea',
        layers: [
          { type: 'wind', frequency: 120, gain: 0.15 },
          { type: 'water', gain: 0.12 },
          { type: 'crowd', gain: 0.06 },
          { type: 'birds', baseFreq: 1500, gain: 0.04 }
        ]
      },
      'eiffel-tower': { // Red Fort
        type: 'fort',
        layers: [
          { type: 'wind', frequency: 140, gain: 0.1 },
          { type: 'crowd', gain: 0.04 },
          { type: 'birds', baseFreq: 2000, gain: 0.03 }
        ]
      }
    };
    
    // Quick fix for the ID change
    this.soundProfiles['red-fort'] = this.soundProfiles['eiffel-tower'];
    delete this.soundProfiles['eiffel-tower'];
  }

  // Initialize audio context (must be called after user gesture)
  init() {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.audioContext.destination);
    } catch(e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  // Create noise buffer for wind/water sounds
  createNoiseBuffer(duration = 2) {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    return buffer;
  }

  // Create wind-like ambient sound
  createWindLayer(frequency, gain) {
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer(4);
    noiseSource.loop = true;
    
    // Bandpass filter for wind character
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 0.5;
    
    // LFO for natural variation
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.value = 0.2 + Math.random() * 0.3;
    lfoGain.gain.value = frequency * 0.3;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    
    const layerGain = this.audioContext.createGain();
    layerGain.gain.value = gain;
    
    noiseSource.connect(filter);
    filter.connect(layerGain);
    layerGain.connect(this.masterGain);
    noiseSource.start();
    
    return { source: noiseSource, lfo, gain: layerGain };
  }

  // Create bird-like chirp sounds
  createBirdLayer(baseFreq, gain) {
    const layerGain = this.audioContext.createGain();
    layerGain.gain.value = gain;
    layerGain.connect(this.masterGain);
    
    const chirp = () => {
      if (!this.isPlaying) return;
      
      const osc = this.audioContext.createOscillator();
      const chirpGain = this.audioContext.createGain();
      const now = this.audioContext.currentTime;
      
      osc.type = 'sine';
      const freq = baseFreq + (Math.random() - 0.5) * 1000;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 0.15);
      
      chirpGain.gain.setValueAtTime(0, now);
      chirpGain.gain.linearRampToValueAtTime(0.3, now + 0.02);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      
      osc.connect(chirpGain);
      chirpGain.connect(layerGain);
      osc.start(now);
      osc.stop(now + 0.25);
      
      // Schedule next chirp
      const delay = 1000 + Math.random() * 4000;
      this._birdTimeout = setTimeout(chirp, delay);
    };
    
    const delay = Math.random() * 2000;
    this._birdTimeout = setTimeout(chirp, delay);
    
    return { gain: layerGain };
  }

  // Create water/stream sounds
  createWaterLayer(gain) {
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer(3);
    noiseSource.loop = true;
    
    const lowpass = this.audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 800;
    
    const highpass = this.audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 200;
    
    // Subtle modulation
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.value = 0.5;
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);
    lfo.start();
    
    const layerGain = this.audioContext.createGain();
    layerGain.gain.value = gain;
    
    noiseSource.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(layerGain);
    layerGain.connect(this.masterGain);
    noiseSource.start();
    
    return { source: noiseSource, lfo, gain: layerGain };
  }

  // Create crowd ambient murmur
  createCrowdLayer(gain) {
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer(5);
    noiseSource.loop = true;
    
    const bandpass = this.audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 400;
    bandpass.Q.value = 0.3;
    
    const layerGain = this.audioContext.createGain();
    layerGain.gain.value = gain;
    
    noiseSource.connect(bandpass);
    bandpass.connect(layerGain);
    layerGain.connect(this.masterGain);
    noiseSource.start();
    
    return { source: noiseSource, gain: layerGain };
  }

  // Create chime/bell sounds
  createChimeLayer(baseFreq, gain) {
    const layerGain = this.audioContext.createGain();
    layerGain.gain.value = gain;
    layerGain.connect(this.masterGain);
    
    const chime = () => {
      if (!this.isPlaying) return;
      
      const osc = this.audioContext.createOscillator();
      const chimeGain = this.audioContext.createGain();
      const now = this.audioContext.currentTime;
      
      osc.type = 'sine';
      const freq = baseFreq * (1 + Math.floor(Math.random() * 5) / 4);
      osc.frequency.value = freq;
      
      chimeGain.gain.setValueAtTime(0.2, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2);
      
      osc.connect(chimeGain);
      chimeGain.connect(layerGain);
      osc.start(now);
      osc.stop(now + 2.5);
      
      const delay = 3000 + Math.random() * 8000;
      this._chimeTimeout = setTimeout(chime, delay);
    };
    
    const delay = 1000 + Math.random() * 3000;
    this._chimeTimeout = setTimeout(chime, delay);
    
    return { gain: layerGain };
  }

  // Start ambient audio for a monument
  playForMonument(monumentId) {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;
    
    // Resume context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    // Stop current audio
    this.stopAll();
    
    this.currentMonument = monumentId;
    const profile = this.soundProfiles[monumentId];
    if (!profile) return;
    
    this.isPlaying = true;
    
    profile.layers.forEach(layer => {
      let node;
      switch(layer.type) {
        case 'wind':
          node = this.createWindLayer(layer.frequency, layer.gain);
          break;
        case 'birds':
          node = this.createBirdLayer(layer.baseFreq, layer.gain);
          break;
        case 'water':
          node = this.createWaterLayer(layer.gain);
          break;
        case 'crowd':
          node = this.createCrowdLayer(layer.gain);
          break;
        case 'chimes':
          node = this.createChimeLayer(layer.baseFreq, layer.gain);
          break;
        case 'stones':
          node = this.createWindLayer(80, layer.gain);
          break;
      }
      if (node) this.activeNodes.push(node);
    });
    
    // Fade in
    this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(
      this.isMuted ? 0 : this.volume, 
      this.audioContext.currentTime + 1
    );
  }

  // Stop all audio
  stopAll() {
    this.isPlaying = false;
    
    // Clear timeouts
    clearTimeout(this._birdTimeout);
    clearTimeout(this._chimeTimeout);
    
    this.activeNodes.forEach(node => {
      try {
        if (node.source) node.source.stop();
        if (node.lfo) node.lfo.stop();
      } catch(e) { /* Already stopped */ }
    });
    this.activeNodes = [];
  }

  // Toggle mute
  toggleMute() {
    if (!this.audioContext) return;
    this.isMuted = !this.isMuted;
    
    const now = this.audioContext.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(
      this.isMuted ? 0 : this.volume, 
      now + 0.3
    );
    
    return this.isMuted;
  }

  // Set volume (0 to 1)
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.linearRampToValueAtTime(
        this.volume, 
        this.audioContext.currentTime + 0.1
      );
    }
  }

  // Cleanup
  destroy() {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Singleton instance
const audioController = new AmbientAudioController();
