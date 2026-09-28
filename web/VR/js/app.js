// ============================================================
// app.js — Main Application Controller
// Orchestrates all modules: panorama, hotspots, chatbot,
// audio, i18n. Manages state and UI interactions.
// ============================================================

class MonumentExplorerApp {
  constructor() {
    // Application state
    this.state = {
      currentMonument: null,
      currentViewpoint: null,
      isChatOpen: false,
      isInfoOpen: false,
      isFullscreen: false,
      isAudioMuted: true,
      isTimeTravelActive: false,
      isLangDropdownOpen: false,
      isHelpOpen: false,
      isLoaded: false,
      isMonumentSelectorVisible: true
    };
    
    // Default monument
    this.defaultMonument = 'taj-mahal';
  }

  // ── Initialization ──
  init() {
    console.log('🏛️ Monument Explorer initializing...');
    
    // Initialize sub-modules
    panoramaManager.init();
    hotspotManager.init();
    gazeNarrator.init();
    // Looking at a section for a moment → the guide explains it.
    gazeNarrator.onGaze = (sec) => {
      if (!voiceGuide.isEnabled) return;
      voiceGuide.speak(gazeNarrator.textFor(sec));
    };
    
    // Set up panorama ready callback
    panoramaManager.onReady = () => {
      this._onPanoramaReady();
    };
    
    // Set up hotspot callbacks
    hotspotManager.onNavigate = (targetId) => {
      this.navigateToViewpoint(targetId);
    };
    
    // Set up chatbot callbacks
    chatbot.onMessage = (msg) => this._renderChatMessage(msg);
    chatbot.onTypingStart = () => this._showTypingIndicator();
    chatbot.onTypingEnd = () => this._hideTypingIndicator();
    
    // Bind all UI event listeners
    this._bindEvents();
    
    // Start loading animation
    this._animateLoading();
    
    // Build monument selector cards
    this._buildMonumentSelector();
    
    // Build language dropdown
    this._buildLanguageDropdown();
  }

  // ── Loading Sequence ──
  _animateLoading() {
    const bar = document.querySelector('.loading-bar');
    const btn = document.querySelector('.loading-enter-btn');
    if (!bar) return;

    // The bar used to be a 2-second timer that had nothing to do with
    // loading. Now it tracks the one thing worth waiting for: the first
    // panorama's texture, which starts downloading right here.
    const monument = getMonument(this.defaultMonument);
    const first = monument && monument.viewpoints && monument.viewpoints[0];
    const ready = first ? panoramaManager._loadTexture(first.panorama) : Promise.resolve();
    // Everything else warms in the background.
    if (first) panoramaManager.preload(first.panorama);

    let progress = 0;
    const tick = setInterval(() => {
      progress = Math.min(90, progress + 12);
      bar.style.width = progress + '%';
    }, 80);
    const done = () => {
      clearInterval(tick);
      bar.style.width = '100%';
      if (btn) btn.classList.add('visible');
    };
    // Never hold the visitor hostage to a slow network: the button appears
    // within 1.5 s regardless and the panorama fades in when it arrives.
    Promise.race([ready, new Promise(r => setTimeout(r, 1500))]).then(done);
  }

  _onPanoramaReady() {
    console.log('✅ Scene ready');
  }

  enterExperience() {
    const loading = document.getElementById('loading-screen');
    if (loading) loading.classList.add('hidden');
    
    this.state.isLoaded = true;
    
    // Load default monument
    this.switchMonument(this.defaultMonument);

    // Warm the other monuments' panoramas while the visitor looks around.
    setTimeout(() => {
      Object.keys(MONUMENTS_DATA || {}).forEach(id => {
        if (id === this.defaultMonument) return;
        const m = getMonument(id);
        (m && m.viewpoints || []).forEach(vp => panoramaManager.preload(vp.panorama));
      });
    }, 4000);

    // Initialize audio (requires user gesture)
    audioController.init();

    // Guide on from the start — this click is the gesture browsers need
    // before they allow speech. The panorama's load callback narrates the
    // first view, so nothing is spoken here. The mic button mutes it.
    if (!voiceGuide.isEnabled) {
      voiceGuide.toggleSystem();
      const btn = document.getElementById('voice-btn');
      if (btn) { btn.classList.add('active'); btn.title = t('voiceGuideOn'); }
      voiceGuide.onStateChange = (isSpeaking) => { if (btn) btn.classList.toggle('speaking', isSpeaking); };
    }
  }

  // ── Monument Switching ──
  switchMonument(monumentId) {
    const monument = getMonument(monumentId);
    if (!monument) return;
    
    this.state.currentMonument = monumentId;
    gazeNarrator.setMonument(monumentId);

    // Return to the present before the new panorama loads, so the reveal
    // never animates across two different monuments.
    if (this.state.isTimeTravelActive) this.setTimeTravel(false);

    // Update active card in selector
    document.querySelectorAll('.monument-card').forEach(card => {
      card.classList.toggle('active', card.dataset.monument === monumentId);
    });
    
    // Load first viewpoint
    const defaultVP = getDefaultViewpoint(monumentId);
    if (defaultVP) {
      this._loadViewpoint(monumentId, defaultVP);
    }
    
    // Update chatbot context
    chatbot.setMonument(monumentId);
    this._rebuildChatMessages();
    this._updateQuickReplies();
    
    // Switch ambient audio
    if (!this.state.isAudioMuted) {
      audioController.playForMonument(monumentId);
    }
    
    // Update viewpoint dots
    this._buildViewpointDots(monument);
    
    
    // Show toast (localized)
    const lang = getCurrentLanguage();
    if (lang === 'hi') {
      const hindiData = getHindiNarration(monumentId);
      this._showToast(`${monument.emoji} ${hindiData ? hindiData.name : monument.name} की खोज करें`);
    } else {
      this._showToast(`${monument.emoji} Exploring ${monument.name}`);
    }
  }

  // ── Viewpoint Navigation ──
  navigateToViewpoint(viewpointId) {
    if (!this.state.currentMonument) return;
    
    const viewpoint = getViewpoint(this.state.currentMonument, viewpointId);
    if (!viewpoint) return;
    
    this._loadViewpoint(this.state.currentMonument, viewpoint);
  }

  _loadViewpoint(monumentId, viewpoint) {
    this.state.currentViewpoint = viewpoint.id;
    
    // Load panorama with transition. `pastPanorama` is optional — without it
    // the aged counterpart is derived by naming convention; set it on a
    // viewpoint (or monument) to point at a real archival photograph instead.
    const pastUrl = viewpoint.pastPanorama
      || (getMonument(monumentId) || {}).pastPanoramaBase
      || null;

    panoramaManager.loadPanorama(viewpoint.panorama, viewpoint.rotation, () => {
      // Create hotspots after panorama loaded
      hotspotManager.createHotspots(viewpoint);
      
      // Voice Guide narration (localized)
      if (voiceGuide.isEnabled) voiceGuide.speak(this._narrationFor(monumentId, viewpoint));
    }, pastUrl);
    
    // Update viewpoint bar
    this._updateViewpointBar(viewpoint);
    
    // Update viewpoint dots
    document.querySelectorAll('.viewpoint-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.viewpoint === viewpoint.id);
    });
    
    // Update historical overlay if time travel is active
    if (this.state.isTimeTravelActive) {
      this._updateHistoricalOverlay();
    }
  }

  _updateViewpointBar(viewpoint) {
    const nameEl = document.querySelector('.viewpoint-name');
    const descEl = document.querySelector('.viewpoint-desc');
    
    if (nameEl) nameEl.textContent = viewpoint.name;
    if (descEl) descEl.textContent = viewpoint.description;
    
    // Re-trigger animation
    const bar = document.getElementById('viewpoint-bar');
    if (bar) {
      bar.style.animation = 'none';
      bar.offsetHeight; // force reflow
      bar.style.animation = '';
    }
  }

  // ── Build UI Components ──
  _buildMonumentSelector() {
    const container = document.querySelector('.monument-selector-inner');
    if (!container) return;
    
    container.innerHTML = '';
    
    getMonumentIds().forEach(id => {
      const m = getMonument(id);
      if (!m) return;
      
      const card = document.createElement('div');
      card.className = 'monument-card';
      card.dataset.monument = id;
      card.innerHTML = `
        <div class="monument-card-emoji">${m.emoji}</div>
        <div class="monument-card-name">${m.name}</div>
        <div class="monument-card-location">${m.location}</div>
      `;
      
      card.addEventListener('click', () => this.switchMonument(id));
      container.appendChild(card);
    });
  }

  _buildViewpointDots(monument) {
    const container = document.getElementById('viewpoint-dots');
    if (!container) return;
    
    container.innerHTML = '';
    
    monument.viewpoints.forEach(vp => {
      const dot = document.createElement('div');
      dot.className = 'viewpoint-dot';
      dot.dataset.viewpoint = vp.id;
      dot.classList.toggle('active', vp.id === this.state.currentViewpoint);
      
      dot.innerHTML = `<div class="viewpoint-dot-tooltip">${vp.name}</div>`;
      dot.addEventListener('click', () => this.navigateToViewpoint(vp.id));
      
      container.appendChild(dot);
    });
  }

  _buildLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    if (!dropdown) return;
    
    dropdown.innerHTML = '';
    
    getAvailableLanguages().forEach(lang => {
      const option = document.createElement('div');
      option.className = 'lang-option';
      option.classList.toggle('active', lang.code === getCurrentLanguage());
      option.innerHTML = `
        <span class="lang-flag">${lang.flag}</span>
        <span>${lang.nativeName}</span>
      `;
      
      option.addEventListener('click', () => {
        setLanguage(lang.code);
        dropdown.querySelectorAll('.lang-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        this.toggleLangDropdown();
        this._showToast(`Language: ${lang.nativeName}`);
      });
      
      dropdown.appendChild(option);
    });
  }

  // ── Chat Panel ──
  toggleChat() {
    this.state.isChatOpen = !this.state.isChatOpen;
    const panel = document.getElementById('chat-panel');
    const btn = document.getElementById('chat-toggle-btn');
    
    if (panel) panel.classList.toggle('open', this.state.isChatOpen);
    if (btn) btn.classList.toggle('active', this.state.isChatOpen);
    
    if (this.state.isChatOpen) {
      const input = document.getElementById('chat-input');
      if (input) setTimeout(() => input.focus(), 300);
    }
  }

  sendChatMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    
    const text = input.value.trim();
    input.value = '';
    chatbot.processUserMessage(text);
  }

  _renderChatMessage(msg) {
    const container = document.querySelector('.chat-messages');
    if (!container) return;
    
    const el = document.createElement('div');
    el.className = `chat-message ${msg.type}`;
    el.innerHTML = this._formatChatText(msg.text);
    container.appendChild(el);
    
    // Auto-scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  /* Escape, then allow only the light formatting the model actually uses:
     **bold**, `code`, line breaks and simple "- " bullets. */
  _formatChatText(text) {
    const esc = String(text || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^\s*[-•]\s+/gm, '• ')
      .replace(/\n/g, '<br>');
  }

  _rebuildChatMessages() {
    const container = document.querySelector('.chat-messages');
    if (!container) return;
    
    container.innerHTML = '';
    chatbot.getMessages().forEach(msg => {
      const el = document.createElement('div');
      el.className = `chat-message ${msg.type}`;
      el.innerHTML = this._formatChatText(msg.text);
      container.appendChild(el);
    });
    
    container.scrollTop = container.scrollHeight;
  }

  _showTypingIndicator() {
    const container = document.querySelector('.chat-messages');
    if (!container) return;
    
    const typing = document.createElement('div');
    typing.className = 'chat-message typing';
    typing.id = 'typing-indicator';
    typing.innerHTML = `
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  _hideTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }

  _updateQuickReplies() {
    const container = document.querySelector('.chat-quick-replies');
    if (!container) return;
    
    container.innerHTML = '';
    
    const questions = chatbot.getSuggestedQuestions();
    questions.forEach(q => {
      const chip = document.createElement('button');
      chip.className = 'quick-reply-chip';
      chip.textContent = q.text;
      chip.addEventListener('click', () => {
        chatbot.processUserMessage(q.text);
      });
      container.appendChild(chip);
    });
  }

  // ── Info Panel ──
  showMonumentInfo() {
    const monument = getMonument(this.state.currentMonument);
    if (!monument) return;
    
    const panel = document.getElementById('info-panel');
    const backdrop = document.getElementById('info-backdrop');
    
    if (panel) {
      panel.querySelector('.info-panel-title').textContent = monument.name;
      panel.querySelector('.info-panel-body').textContent = monument.description;
      
      // Update meta items
      const metaContainer = panel.querySelector('.info-panel-meta');
      if (metaContainer) {
        metaContainer.innerHTML = `
          <div class="info-meta-item">
            <div class="info-meta-label">${t('location')}</div>
            <div class="info-meta-value">${monument.location}</div>
          </div>
          <div class="info-meta-item">
            <div class="info-meta-label">${t('yearBuilt')}</div>
            <div class="info-meta-value">${monument.year}</div>
          </div>
          <div class="info-meta-item">
            <div class="info-meta-label">${t('architect')}</div>
            <div class="info-meta-value">${monument.architect}</div>
          </div>
          <div class="info-meta-item">
            <div class="info-meta-label">${t('category')}</div>
            <div class="info-meta-value">${monument.category}</div>
          </div>
        `;
      }
      
      panel.classList.add('open');
    }
    if (backdrop) backdrop.classList.add('open');
    
    this.state.isInfoOpen = true;
  }

  closeMonumentInfo() {
    const panel = document.getElementById('info-panel');
    const backdrop = document.getElementById('info-backdrop');
    
    if (panel) panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    
    this.state.isInfoOpen = false;
  }

  // ── Fullscreen ──
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      this.state.isFullscreen = true;
    } else {
      document.exitFullscreen().catch(() => {});
      this.state.isFullscreen = false;
    }
    
    const btn = document.getElementById('fullscreen-btn');
    if (btn) btn.textContent = this.state.isFullscreen ? '⛶' : '⛶';
  }

  // ── Audio ──
  toggleAudio() {
    audioController.init(); // ensure initialized
    
    if (this.state.isAudioMuted) {
      // Unmute — start playing
      this.state.isAudioMuted = false;
      audioController.isMuted = false;
      if (this.state.currentMonument) {
        audioController.playForMonument(this.state.currentMonument);
      }
    } else {
      // Mute
      this.state.isAudioMuted = true;
      audioController.toggleMute();
    }
    
    // Update UI
    const indicator = document.querySelector('.audio-indicator');
    if (indicator) {
      indicator.classList.toggle('muted', this.state.isAudioMuted);
    }
    
    const btn = document.getElementById('audio-btn');
    if (btn) btn.title = this.state.isAudioMuted ? t('audioOff') : t('audioOn');
  }

  // ── Voice Guide ──
  /* What the guide says about a viewpoint, in the current language. */
  _narrationFor(monumentId, viewpoint) {
    if (!viewpoint) return '';
    const monument = getMonument(monumentId) || {};
    if (getCurrentLanguage() === 'hi') {
      const hi = getHindiNarration(monumentId, viewpoint.id);
      if (hi) return `आप अभी ${hi.name} देख रहे हैं। ${hi.description}`;
    }
    const where = monument.name ? ` at ${monument.name}` : '';
    return `You are now looking at ${viewpoint.name}${where}. ${viewpoint.description}`;
  }

  /* Mic button: turn the guide on and explain what is on screen right
     away. Speaking inside the tap matters — phones refuse speech that
     starts later, so the explanation must not wait for the next viewpoint. */
  toggleVoice() {
    const btn = document.getElementById('voice-btn');
    const isEnabled = voiceGuide.toggleSystem();
    if (btn) {
      btn.classList.toggle('active', isEnabled);
      btn.title = isEnabled ? t('voiceGuideOn') : t('voiceGuideTitle');
    }

    // Bind state change to pulsate button when speaking
    voiceGuide.onStateChange = (isSpeaking) => {
      if (btn) btn.classList.toggle('speaking', isSpeaking);
    };

    if (isEnabled) {
      gazeNarrator.forget();
      const viewpoint = getViewpoint(this.state.currentMonument, this.state.currentViewpoint);
      const text = this._narrationFor(this.state.currentMonument, viewpoint);
      if (text) voiceGuide.speak(text);
    }
  }

  // ── Language ──
  toggleLangDropdown() {
    this.state.isLangDropdownOpen = !this.state.isLangDropdownOpen;
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) dropdown.classList.toggle('open', this.state.isLangDropdownOpen);
  }

  // ── Time Travel ──
  toggleTimeTravel() {
    this.setTimeTravel(!this.state.isTimeTravelActive);
  }

  setTimeTravel(active) {
    if (this.state.isTimeTravelActive === active) return;
    this.state.isTimeTravelActive = active;
    panoramaManager.setTimeTravel(active);

    const toggle = document.querySelector('.time-travel-toggle');
    if (toggle) toggle.classList.toggle('active', active);
    toggle?.setAttribute('aria-pressed', String(active));

    // Tints the surrounding UI so the whole frame, not just the sky, shifts era.
    document.body.classList.toggle('chronos-active', active);

    const eraEl = document.querySelector('.time-travel-era');
    if (eraEl) {
      const monument = getMonument(this.state.currentMonument);
      eraEl.textContent = active
        ? (monument ? monument.historicalInfo.era : t('historical'))
        : t('presentDay');
    }

    if (active) {
      const monument = getMonument(this.state.currentMonument);
      if (monument) this._showToast(`⏳ ${monument.historicalInfo.era}`);
    }

    this._updateHistoricalOverlay();
  }

  _updateHistoricalOverlay() {
    const overlay = document.getElementById('historical-overlay');
    if (!overlay) return;
    
    if (this.state.isTimeTravelActive) {
      const monument = getMonument(this.state.currentMonument);
      if (monument) {
        overlay.textContent = monument.historicalInfo.pastDescription;
        overlay.classList.add('visible');
      }
    } else {
      overlay.classList.remove('visible');
    }
  }

  // ── Help ──
  toggleHelp() {
    this.state.isHelpOpen = !this.state.isHelpOpen;
    const overlay = document.getElementById('help-overlay');
    if (overlay) overlay.classList.toggle('open', this.state.isHelpOpen);
  }

  // ── Toast Notifications ──
  _showToast(message, duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ── Event Binding ──
  _bindEvents() {
    // Loading screen enter button
    const enterBtn = document.querySelector('.loading-enter-btn');
    if (enterBtn) enterBtn.addEventListener('click', () => this.enterExperience());
    
    // Top bar buttons
    document.getElementById('fullscreen-btn')?.addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('audio-btn')?.addEventListener('click', () => this.toggleAudio());
    document.getElementById('voice-btn')?.addEventListener('click', () => this.toggleVoice());
    document.getElementById('lang-btn')?.addEventListener('click', () => this.toggleLangDropdown());
    document.getElementById('info-btn')?.addEventListener('click', () => this.showMonumentInfo());
    document.getElementById('help-btn')?.addEventListener('click', () => this.toggleHelp());
    
    // Navigation controls
    document.getElementById('nav-left')?.addEventListener('click', () => panoramaManager.rotateCamera('left'));
    document.getElementById('nav-right')?.addEventListener('click', () => panoramaManager.rotateCamera('right'));
    document.getElementById('nav-up')?.addEventListener('click', () => panoramaManager.rotateCamera('up'));
    document.getElementById('nav-down')?.addEventListener('click', () => panoramaManager.rotateCamera('down'));
    
    // Zoom controls
    document.getElementById('zoom-in-btn')?.addEventListener('click', () => panoramaManager.zoomIn());
    document.getElementById('zoom-out-btn')?.addEventListener('click', () => panoramaManager.zoomOut());
    
    // Chat
    document.getElementById('chat-toggle-btn')?.addEventListener('click', () => this.toggleChat());
    document.getElementById('chat-close-btn')?.addEventListener('click', () => this.toggleChat());
    document.getElementById('chat-send-btn')?.addEventListener('click', () => this.sendChatMessage());
    
    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendChatMessage();
    });
    
    // Info panel close
    document.getElementById('info-panel-close')?.addEventListener('click', () => this.closeMonumentInfo());
    document.getElementById('info-backdrop')?.addEventListener('click', () => this.closeMonumentInfo());
    
    // Time travel
    const ttToggle = document.querySelector('.time-travel-toggle');
    ttToggle?.addEventListener('click', () => this.toggleTimeTravel());
    ttToggle?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTimeTravel();
      }
    });
    
    // Hotspot info popup close
    document.querySelector('.monument-info-popup-close')?.addEventListener('click', () => {
      hotspotManager.hideInfoPopup();
    });
    
    // Help overlay close
    document.querySelector('.help-close-btn')?.addEventListener('click', () => this.toggleHelp());
    document.getElementById('help-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.toggleHelp();
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (this.state.isLangDropdownOpen && 
          !e.target.closest('#language-dropdown') && 
          !e.target.closest('#lang-btn')) {
        this.state.isLangDropdownOpen = false;
        document.getElementById('language-dropdown')?.classList.remove('open');
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key) {
        case 'Escape':
          if (this.state.isChatOpen) this.toggleChat();
          if (this.state.isInfoOpen) this.closeMonumentInfo();
          if (this.state.isHelpOpen) this.toggleHelp();
          break;
        case 'f':
        case 'F':
          this.toggleFullscreen();
          break;
        case 'm':
        case 'M':
          this.toggleAudio();
          break;
        case 'c':
        case 'C':
          this.toggleChat();
          break;
        case 't':
        case 'T':
          this.toggleTimeTravel();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          panoramaManager.rotateCamera('left');
          break;
        case 'ArrowRight':
          panoramaManager.rotateCamera('right');
          break;
        case 'ArrowUp':
          panoramaManager.rotateCamera('up');
          break;
        case 'ArrowDown':
          panoramaManager.rotateCamera('down');
          break;
        case '+':
        case '=':
          panoramaManager.zoomIn();
          break;
        case '-':
          panoramaManager.zoomOut();
          break;
      }
    });
    
    // Fullscreen change event
    document.addEventListener('fullscreenchange', () => {
      this.state.isFullscreen = !!document.fullscreenElement;
    });
  }
}

// ── Boot ──
const app = new MonumentExplorerApp();

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
