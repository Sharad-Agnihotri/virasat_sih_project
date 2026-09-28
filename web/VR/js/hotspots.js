// ============================================================
// hotspots.js — Interactive Hotspot System
// Creates and manages clickable hotspots in the 3D scene
// using A-Frame entities with raycaster-based click detection
// ============================================================

class HotspotManager {
  constructor() {
    this.hotspots = [];
    this.container = null;
    this.onNavigate = null;  // callback(targetViewpointId)
    this.onShowInfo = null;  // callback(info)
    this.activeInfoPopup = null;
  }

  // Initialize hotspot container
  init() {
    this.container = document.getElementById('hotspots-container');
    if (!this.container) {
      console.warn('Hotspots container not found in A-Frame scene');
    }
  }

  // Clear all current hotspots
  clearHotspots() {
    if (this.container) {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }
    this.hotspots = [];
    this.hideInfoPopup();
  }

  // Create hotspots from viewpoint data
  createHotspots(viewpointData) {
    this.clearHotspots();
    
    if (!viewpointData || !viewpointData.hotspots) return;
    
    viewpointData.hotspots.forEach(hsData => {
      this.createHotspot(hsData);
    });
  }

  // Create a single hotspot entity
  createHotspot(data) {
    if (!this.container) return;
    
    const entity = document.createElement('a-entity');
    entity.setAttribute('position', data.position);
    entity.classList.add('hotspot');
    entity.setAttribute('id', data.id);
    
    // Create the visual marker
    // Outer ring (pulsing)
    const outerRing = document.createElement('a-ring');
    outerRing.setAttribute('radius-inner', '0.35');
    outerRing.setAttribute('radius-outer', '0.45');
    outerRing.setAttribute('color', data.type === 'info' ? '#60a5fa' : '#e5a54b');
    outerRing.setAttribute('opacity', '0.6');
    outerRing.setAttribute('side', 'double');
    outerRing.setAttribute('animation', 'property: scale; from: 1 1 1; to: 1.4 1.4 1.4; dur: 1500; easing: easeInOutSine; loop: true; dir: alternate');
    outerRing.setAttribute('animation__opacity', 'property: opacity; from: 0.6; to: 0.1; dur: 1500; easing: easeInOutSine; loop: true; dir: alternate');
    outerRing.classList.add('hotspot-clickable');
    entity.appendChild(outerRing);
    
    // Inner circle (clickable)
    const innerCircle = document.createElement('a-circle');
    innerCircle.setAttribute('radius', '0.3');
    innerCircle.setAttribute('color', data.type === 'info' ? '#3b82f6' : '#d4954b');
    innerCircle.setAttribute('opacity', '0.85');
    innerCircle.setAttribute('side', 'double');
    innerCircle.classList.add('hotspot-clickable');
    entity.appendChild(innerCircle);
    
    // Icon text
    const iconText = document.createElement('a-text');
    iconText.setAttribute('value', data.icon || '→');
    iconText.setAttribute('align', 'center');
    iconText.setAttribute('width', '2');
    iconText.setAttribute('position', '0 0 0.01');
    iconText.setAttribute('color', '#ffffff');
    iconText.setAttribute('side', 'double');
    entity.appendChild(iconText);
    
    // Label text (appears on hover via A-Frame events)
    const labelText = document.createElement('a-text');
    labelText.setAttribute('value', data.label);
    labelText.setAttribute('align', 'center');
    labelText.setAttribute('width', '3');
    labelText.setAttribute('position', '0 -0.6 0');
    labelText.setAttribute('color', '#ffffff');
    labelText.setAttribute('opacity', '0.9');
    labelText.setAttribute('side', 'double');
    entity.appendChild(labelText);
    
    // Make the entity look at the camera
    entity.setAttribute('look-at', '[camera]');
    
    // Handle click events
    entity.addEventListener('click', () => {
      this._handleHotspotClick(data);
    });
    
    // Also handle mouseenter/mouseleave for cursor hover
    entity.addEventListener('mouseenter', () => {
      innerCircle.setAttribute('opacity', '1');
      innerCircle.setAttribute('scale', '1.2 1.2 1.2');
    });
    
    entity.addEventListener('mouseleave', () => {
      innerCircle.setAttribute('opacity', '0.85');
      innerCircle.setAttribute('scale', '1 1 1');
    });
    
    this.container.appendChild(entity);
    this.hotspots.push({ entity, data });
    this._refreshRaycaster();
  }

  // A-Frame's raycaster caches its target list; entities added afterwards are
  // invisible to it until it is told to rescan.
  _refreshRaycaster() {
    clearTimeout(this._refreshTimer);
    this._refreshTimer = setTimeout(() => {
      const cam = document.getElementById('main-camera');
      const rc = cam && cam.components && cam.components.raycaster;
      if (rc) rc.refreshObjects();
    }, 0);
  }

  // Handle hotspot click
  _handleHotspotClick(data) {
    switch(data.type) {
      case 'navigation':
        if (this.onNavigate) {
          this.onNavigate(data.target);
        }
        break;
      case 'info':
        this.showInfoPopup(data);
        break;
      case 'media':
        // Future: open media viewer
        break;
    }
  }

  // Show info popup
  showInfoPopup(data) {
    const popup = document.getElementById('hotspot-info-popup');
    if (!popup) return;
    
    const title = popup.querySelector('.monument-info-popup-title');
    const body = popup.querySelector('.monument-info-popup-body');
    
    if (title) title.textContent = data.label;
    if (body) body.textContent = data.info || '';
    
    popup.classList.add('visible');
    this.activeInfoPopup = data.id;
    
    if (this.onShowInfo) this.onShowInfo(data);
  }

  // Hide info popup
  hideInfoPopup() {
    const popup = document.getElementById('hotspot-info-popup');
    if (popup) popup.classList.remove('visible');
    this.activeInfoPopup = null;
  }

  // Cleanup
  destroy() {
    this.clearHotspots();
  }
}

// A-Frame component: make entity always face the camera (billboarding).
AFRAME.registerComponent('look-at', {
  schema: { type: 'selector' },

  init: function () {
    this._worldPos = new THREE.Vector3();
  },

  tick: function () {
    const camera = this.el.sceneEl.camera;
    if (!camera) return;
    // lookAt expects a WORLD position. The previous version passed the
    // camera's local .position, which is (0, 1.6, 0) and never changes, so
    // hotspots pointed at a fixed spot instead of tracking the viewer.
    camera.getWorldPosition(this._worldPos);
    this.el.object3D.lookAt(this._worldPos);
  }
});

// Singleton
const hotspotManager = new HotspotManager();
