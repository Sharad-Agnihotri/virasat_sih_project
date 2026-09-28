/* ==========================================================================
   VIRASAT ROYAL MEMBERSHIP & UNIFIED SUBSCRIPTION CONTROLLER
   Handles trial enforcement (5 free scans per account) & Interactive Payment.
   The Virasat Mitr AI chatbot is free and unlimited and is NOT metered.
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    SCANS: 'virasat_scan_count',
    CHATS: 'virasat_chat_count',
    SUBSCRIBED: 'virasat_is_subscribed',
    PLAN_TYPE: 'virasat_plan_type',
    EXPIRY: 'virasat_plan_expiry'
  };

  // Enforce mandatory login gate (default to true if unset for local preview)
  const currentPath = window.location.pathname.toLowerCase();
  if (localStorage.getItem('virasat_user_logged_in') === null) {
    localStorage.setItem('virasat_user_logged_in', 'true');
  }
  if (!currentPath.endsWith('login.html') && localStorage.getItem('virasat_user_logged_in') !== 'true') {
    window.location.href = 'login.html';
  }

  const MAX_FREE_SCANS = 5;
  const MAX_FREE_CHATS = 2;

  /* Usage is metered per signed-in account, not per browser: the counter key
     carries the email, so a second person signing in on the same device gets
     their own five scans and the first person's count is untouched. */
  function accountId() {
    const email = (localStorage.getItem('virasat_user_email') || '').trim().toLowerCase();
    return email || 'guest';
  }
  function userKey(base) {
    return base + ':' + accountId();
  }
  function readCount(base) {
    return parseInt(localStorage.getItem(userKey(base)) || '0', 10) || 0;
  }
  function writeCount(base, value) {
    try { localStorage.setItem(userKey(base), String(value)); } catch (e) { /* private mode */ }
  }

  window.VirasatSub = {
    MAX_FREE_SCANS: MAX_FREE_SCANS,
    getAccountId: accountId,
    getScanCount: function () {
      return readCount(STORAGE_KEYS.SCANS);
    },
    incrementScanCount: function () {
      const next = this.getScanCount() + 1;
      writeCount(STORAGE_KEYS.SCANS, next);
      return next;
    },
    getChatCount: function () {
      return readCount(STORAGE_KEYS.CHATS);
    },
    incrementChatCount: function () {
      const next = this.getChatCount() + 1;
      writeCount(STORAGE_KEYS.CHATS, next);
      return next;
    },
    isSubscribed: function () {
      return localStorage.getItem(STORAGE_KEYS.SUBSCRIBED) === 'true';
    },
    setSubscribed: function (subscribed, planType = 'Yearly') {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBED, subscribed ? 'true' : 'false');
      if (subscribed) {
        localStorage.setItem(STORAGE_KEYS.PLAN_TYPE, planType);
        const expiryDate = new Date();
        if (planType === 'Yearly') {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        } else {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        }
        localStorage.setItem(STORAGE_KEYS.EXPIRY, expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
      }
    },
    getPlanInfo: function () {
      if (!this.isSubscribed()) {
        return {
          isSubscribed: false,
          scansLeft: Math.max(0, MAX_FREE_SCANS - this.getScanCount()),
          scansTotal: MAX_FREE_SCANS,
          chatsLeft: Infinity   // chatbot is free and unlimited
        };
      }
      return {
        isSubscribed: true,
        planType: localStorage.getItem(STORAGE_KEYS.PLAN_TYPE) || 'Royal Pass',
        expiry: localStorage.getItem(STORAGE_KEYS.EXPIRY) || 'Active'
      };
    },

    canScan: function () {
      if (this.isSubscribed()) return true;
      return this.getScanCount() < MAX_FREE_SCANS;
    },

    // The Virasat Mitr AI chatbot is free and unlimited for everyone.
    // Scans and the other Royal Pass benefits are still metered below.
    canChat: function () {
      return true;
    },

    canAccessVR: function () {
      return true;
    },

    showModal: function (reason = 'general') {
      injectModalStyles();
      openSubscriptionModal(reason);
    }
  };

  /* ── Inject Custom Glassmorphic Styles ── */
  function injectModalStyles() {
    if (document.getElementById('virasat-sub-styles')) return;

    const style = document.createElement('style');
    style.id = 'virasat-sub-styles';
    style.textContent = `
      .v-sub-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(7, 9, 15, 0.88);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      }
      .v-sub-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }

      .v-sub-card {
        background: linear-gradient(145deg, rgba(22, 26, 38, 0.95), rgba(13, 16, 25, 0.98));
        border: 1px solid rgba(245, 158, 11, 0.35);
        border-radius: 28px;
        max-width: 540px;
        width: 100%;
        padding: 36px 32px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(245, 158, 11, 0.15);
        position: relative;
        transform: scale(0.92) translateY(20px);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        color: #fff;
        overflow: hidden;
      }
      .v-sub-overlay.active .v-sub-card {
        transform: scale(1) translateY(0);
      }

      .v-sub-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #aaa;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .v-sub-close:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        transform: rotate(90deg);
      }

      .v-sub-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1));
        border: 1px solid rgba(245, 158, 11, 0.4);
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 2px;
        color: #fbbf24;
        text-transform: uppercase;
        margin-bottom: 16px;
      }

      .v-sub-title {
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 700;
        line-height: 1.25;
        margin-bottom: 10px;
        background: linear-gradient(135deg, #ffffff 0%, #fef3c7 60%, #f59e0b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .v-sub-reason {
        font-size: 14px;
        color: #94a3b8;
        margin-bottom: 24px;
        line-height: 1.5;
      }
      .v-sub-reason strong {
        color: #fbbf24;
      }

      /* ── Interactive Billing Switcher ── */
      .v-sub-switch-box {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(10, 12, 20, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 999px;
        padding: 4px;
        margin-bottom: 24px;
        position: relative;
      }
      .v-sub-switch-btn {
        flex: 1;
        padding: 10px 16px;
        border: none;
        background: transparent;
        color: #94a3b8;
        font-size: 13px;
        font-weight: 600;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.25s ease;
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      .v-sub-switch-btn.active {
        color: #0f172a;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
        font-weight: 700;
      }
      .v-save-tag {
        font-size: 10px;
        background: #0f172a;
        color: #fbbf24;
        padding: 2px 6px;
        border-radius: 999px;
        text-transform: uppercase;
      }

      /* ── Interactive Plan Cards ── */
      .v-sub-plans-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }
      .v-plan-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 20px 16px;
        cursor: pointer;
        transition: all 0.25s ease;
        position: relative;
        text-align: center;
      }
      .v-plan-card:hover {
        border-color: rgba(245, 158, 11, 0.5);
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.05);
      }
      .v-plan-card.selected {
        border-color: #f59e0b;
        background: linear-gradient(145deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.6));
        box-shadow: 0 0 25px rgba(245, 158, 11, 0.2);
      }

      .v-plan-card .pop-tag {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(90deg, #d97706, #f59e0b);
        color: #000;
        font-size: 10px;
        font-weight: 800;
        padding: 3px 10px;
        border-radius: 999px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      .v-plan-name {
        font-size: 14px;
        font-weight: 600;
        color: #cbd5e1;
        margin-bottom: 8px;
      }
      .v-plan-price {
        font-family: 'Outfit', sans-serif;
        font-size: 26px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 4px;
      }
      .v-plan-period {
        font-size: 11px;
        color: #64748b;
      }

      /* ── Features List ── */
      .v-sub-perks {
        background: rgba(0, 0, 0, 0.25);
        border-radius: 16px;
        padding: 16px 20px;
        margin-bottom: 24px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      .v-perk-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: #e2e8f0;
        margin-bottom: 10px;
      }
      .v-perk-item:last-child {
        margin-bottom: 0;
      }
      .v-perk-icon {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: rgba(34, 197, 94, 0.2);
        color: #4ade80;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        flex-shrink: 0;
      }

      /* ── Action Button ── */
      .v-sub-action-btn {
        width: 100%;
        padding: 16px;
        border: none;
        border-radius: 16px;
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
        color: #0f172a;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
        transition: all 0.25s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      .v-sub-action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 40px rgba(245, 158, 11, 0.55);
        filter: brightness(1.05);
      }

      /* ── Checkout Drawer Overlay ── */
      .v-checkout-drawer {
        position: absolute;
        inset: 0;
        background: #0f1420;
        border-radius: 28px;
        padding: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transform: translateY(100%);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 10;
      }
      .v-checkout-drawer.active {
        transform: translateY(0);
      }

      .v-checkout-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .v-checkout-title {
        font-family: 'Outfit', sans-serif;
        font-size: 20px;
        font-weight: 700;
        color: #fff;
      }

      .v-pay-methods {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
      }
      .v-pay-opt {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .v-pay-opt:hover, .v-pay-opt.selected {
        border-color: #f59e0b;
        background: rgba(245, 158, 11, 0.08);
      }
      .v-pay-left {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 600;
      }
      .v-pay-left span.icon {
        font-size: 20px;
      }

      .v-qr-box {
        background: #fff;
        padding: 16px;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin: 0 auto 16px auto;
        width: fit-content;
      }
      .v-qr-box img {
        width: 140px;
        height: 140px;
      }
      .v-qr-label {
        font-size: 11px;
        color: #0f172a;
        font-weight: 700;
      }

      .v-success-screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 100%;
        gap: 16px;
      }
      .v-success-icon {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: #fff;
        font-size: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
        animation: popScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      @keyframes popScale {
        0% { transform: scale(0.3); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Inject & Render Modal HTML ── */
  function openSubscriptionModal(reason) {
    let overlay = document.getElementById('virasatSubOverlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'virasatSubOverlay';
      overlay.className = 'v-sub-overlay';
      document.body.appendChild(overlay);
    }

    let reasonText = 'Unlock full platform features with Virasat Royal Membership.';
    if (reason === 'scan') {
      reasonText = 'You have used all <strong>' + MAX_FREE_SCANS + ' free AI Monument Scans</strong> for this account. Upgrade to Royal Pass for unlimited AI scans!';
    } else if (reason === 'chat') {
      // Kept only so an old call site cannot crash; chat is never gated now.
      reasonText = 'Unlock full platform features with Virasat Royal Membership.';
    } else if (reason === 'vr') {
      reasonText = '<strong>360° VR Heritage Tours</strong> are an exclusive Virasat Royal feature. Subscribe to unlock all virtual tours!';
    }

    overlay.innerHTML = `
      <div class="v-sub-card">
        <button class="v-sub-close" id="vSubCloseBtn">✕</button>

        <div class="v-sub-badge">👑 Virasat Royal Pass</div>
        <h2 class="v-sub-title">Unlock Timeless Heritage</h2>
        <p class="v-sub-reason">${reasonText}</p>

        <!-- Billing Cycle Switcher -->
        <div class="v-sub-switch-box">
          <button class="v-sub-switch-btn active" id="vSwitchYearly">
            <span>Yearly (Save 50%)</span>
            <span class="v-save-tag">Best Value</span>
          </button>
          <button class="v-sub-switch-btn" id="vSwitchMonthly">
            <span>Monthly</span>
          </button>
        </div>

        <!-- Plan Cards -->
        <div class="v-sub-plans-grid">
          <div class="v-plan-card selected" id="vPlanYearly">
            <div class="pop-tag">👑 POPULAR</div>
            <div class="v-plan-name">Yearly Royal Pass</div>
            <div class="v-plan-price">₹899</div>
            <div class="v-plan-period">₹75/mo billed annually</div>
          </div>
          <div class="v-plan-card" id="vPlanMonthly">
            <div class="v-plan-name">Monthly Royal Pass</div>
            <div class="v-plan-price">₹149</div>
            <div class="v-plan-period">billed monthly</div>
          </div>
        </div>

        <!-- Feature Checklist -->
        <div class="v-sub-perks">
          <div class="v-perk-item">
            <div class="v-perk-icon">✓</div>
            <span><strong>Unlimited AI Monument Scans</strong> (Instant identification)</span>
          </div>
          <div class="v-perk-item">
            <div class="v-perk-icon">✓</div>
            <span><strong>Personalised Voice Guide</strong> &amp; priority AI responses</span>
          </div>
          <div class="v-perk-item">
            <div class="v-perk-icon">✓</div>
            <span><strong>Full 360° VR Monument Tours</strong> (Taj Mahal, Hampi, etc.)</span>
          </div>
          <div class="v-perk-item">
            <div class="v-perk-icon">✓</div>
            <span><strong>10% Off GI-Tagged Artisan Crafts</strong> & VIP Event Access</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button class="v-sub-action-btn" id="vSubProceedBtn">
          <span>Upgrade to Royal Pass</span>
          <span>→</span>
        </button>

        <!-- Interactive Checkout Drawer -->
        <div class="v-checkout-drawer" id="vCheckoutDrawer">
          <div>
            <div class="v-checkout-header">
              <div class="v-checkout-title">Select Payment Method</div>
              <button class="v-sub-close" style="position:static;" id="vCheckoutCloseBtn">✕</button>
            </div>

            <div class="v-qr-box">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=virasat@upi%26pn=Virasat%20Heritage%20Platform%26am=899" alt="UPI QR Code">
              <div class="v-qr-label">Scan with GPay / PhonePe / Paytm</div>
            </div>

            <div class="v-pay-methods">
              <div class="v-pay-opt selected" id="optUpi">
                <div class="v-pay-left">
                  <span class="icon">📱</span>
                  <div>
                    <div>UPI Direct (GPay / PhonePe)</div>
                    <div style="font-size:11px; color:#64748b;">Instant 1-Click Payment</div>
                  </div>
                </div>
                <div style="color:#4ade80; font-size:12px; font-weight:700;">FAST</div>
              </div>

              <div class="v-pay-opt" id="optCard">
                <div class="v-pay-left">
                  <span class="icon">💳</span>
                  <div>
                    <div>Credit / Debit Card</div>
                    <div style="font-size:11px; color:#64748b;">Visa, Mastercard, RuPay</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button class="v-sub-action-btn" id="vConfirmPayBtn">
            <span>Pay <span id="vPayAmountText">₹899</span> & Activate Instant Pass</span>
          </button>
        </div>
      </div>
    `;

    // Show Overlay
    setTimeout(() => overlay.classList.add('active'), 20);

    // Event Bindings
    const closeBtn = document.getElementById('vSubCloseBtn');
    const switchYearly = document.getElementById('vSwitchYearly');
    const switchMonthly = document.getElementById('vSwitchMonthly');
    const planYearly = document.getElementById('vPlanYearly');
    const planMonthly = document.getElementById('vPlanMonthly');
    const proceedBtn = document.getElementById('vSubProceedBtn');
    const checkoutDrawer = document.getElementById('vCheckoutDrawer');
    const checkoutCloseBtn = document.getElementById('vCheckoutCloseBtn');
    const confirmPayBtn = document.getElementById('vConfirmPayBtn');
    const payAmountText = document.getElementById('vPayAmountText');

    let selectedPlan = 'Yearly';
    let selectedAmount = '₹899';

    function closeAll() {
      overlay.classList.remove('active');
    }

    closeBtn.onclick = closeAll;
    overlay.onclick = (e) => {
      if (e.target === overlay) closeAll();
    };

    function selectPlan(plan) {
      selectedPlan = plan;
      if (plan === 'Yearly') {
        switchYearly.classList.add('active');
        switchMonthly.classList.remove('active');
        planYearly.classList.add('selected');
        planMonthly.classList.remove('selected');
        selectedAmount = '₹899';
      } else {
        switchMonthly.classList.add('active');
        switchYearly.classList.remove('active');
        planMonthly.classList.add('selected');
        planYearly.classList.remove('selected');
        selectedAmount = '₹149';
      }
      payAmountText.textContent = selectedAmount;
    }

    switchYearly.onclick = () => selectPlan('Yearly');
    switchMonthly.onclick = () => selectPlan('Monthly');
    planYearly.onclick = () => selectPlan('Yearly');
    planMonthly.onclick = () => selectPlan('Monthly');

    proceedBtn.onclick = () => {
      checkoutDrawer.classList.add('active');
    };
    checkoutCloseBtn.onclick = () => {
      checkoutDrawer.classList.remove('active');
    };

    confirmPayBtn.onclick = () => {
      confirmPayBtn.disabled = true;
      confirmPayBtn.innerHTML = `<span>Activating Royal Pass...</span>`;

      setTimeout(() => {
        window.VirasatSub.setSubscribed(true, selectedPlan);

        checkoutDrawer.innerHTML = `
          <div class="v-success-screen">
            <div class="v-success-icon">✓</div>
            <h3 style="font-family:'Outfit'; font-size:24px; color:#fff;">Welcome to Virasat Royal!</h3>
            <p style="font-size:14px; color:#94a3b8;">Your ${selectedPlan} Royal Pass is now active. All AI Scans, Chatbot queries & VR Tours are unlocked!</p>
            <button class="v-sub-action-btn" id="vDoneBtn" style="margin-top:16px;">Start Exploring Now</button>
          </div>
        `;

        document.getElementById('vDoneBtn').onclick = () => {
          closeAll();
          window.location.reload();
        };
      }, 1200);
    };
  }
})();
