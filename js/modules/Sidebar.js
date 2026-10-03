/**
 * js/modules/Sidebar.js
 * FCMB Application — Sidebar Module
 *
 * Handles: collapse/expand, mobile open/close, overlay,
 *          localStorage persistence, active nav routing.
 *
 * Pattern: Prototype (Constructor + Prototype methods)
 * Registered on: FCMB.modules.Sidebar
 * Depends: namespace.js, utils.js
 */

;(function (FCMB) {
  'use strict';

  var U = FCMB.Utils;

  /* ══════════════════════════════════════════════════════════
     Constructor
     ══════════════════════════════════════════════════════════ */

  /**
   * @param {Object} opts
   * @param {string} opts.selector        — '#sidebar'
   * @param {string} opts.collapseBtn     — '#collapseSidebar'
   * @param {string} opts.mobileOpenBtn   — '#mobileSidebarOpen'
   * @param {string} opts.mobileCloseBtn  — '#mobileSidebarClose'
   * @param {string} opts.overlay         — '#sidebarOverlay'
   * @param {string} [opts.storageKey]    — localStorage key
   */
  function Sidebar(opts) {
    this.el          = U.qs(opts.selector);
    this.collapseBtn = U.qs(opts.collapseBtn);
    this.openBtn     = U.qs(opts.mobileOpenBtn);
    this.closeBtn    = U.qs(opts.mobileCloseBtn);
    this.overlay     = U.qs(opts.overlay);
    this.storageKey  = opts.storageKey || 'fcmb-sidebar-collapsed';
    this.mainEl      = U.qs('#main') || U.qs('.main');

    if (!this.el) {
      console.warn('[Sidebar] element not found:', opts.selector);
      return;
    }

    this._restoreState();
    this._bindEvents();
  }

  /* ══════════════════════════════════════════════════════════
     Prototype methods
     ══════════════════════════════════════════════════════════ */

  /**
   * Toggle collapsed state (desktop) or mobile-open (mobile).
   */
  Sidebar.prototype.toggle = function () {
    if (window.innerWidth <= 850) {
      this._toggleMobile();
    } else {
      this._toggleDesktop();
    }
  };

  /** Expand the sidebar (desktop). */
  Sidebar.prototype.expand = function () {
    this.el.classList.remove('collapsed');
    U.storeSet(this.storageKey, '0');
  };

  /** Collapse the sidebar (desktop). */
  Sidebar.prototype.collapse = function () {
    this.el.classList.add('collapsed');
    U.storeSet(this.storageKey, '1');
  };

  /** Open mobile drawer. */
  Sidebar.prototype.openMobile = function () {
    this.el.classList.add('mobile-open');
    if (this.overlay) { this.overlay.classList.add('open'); }
    document.body.style.overflow = 'hidden';
  };

  /** Close mobile drawer. */
  Sidebar.prototype.closeMobile = function () {
    this.el.classList.remove('mobile-open');
    if (this.overlay) { this.overlay.classList.remove('open'); }
    document.body.style.overflow = '';
  };

  /* ── Private ─────────────────────────────────────────────── */

  Sidebar.prototype._toggleDesktop = function () {
    if (this.el.classList.contains('collapsed')) {
      this.expand();
    } else {
      this.collapse();
    }
  };

  Sidebar.prototype._toggleMobile = function () {
    if (this.el.classList.contains('mobile-open')) {
      this.closeMobile();
    } else {
      this.openMobile();
    }
  };

  /** Restore last known collapsed state from localStorage. */
  Sidebar.prototype._restoreState = function () {
    var stored = U.store(this.storageKey);
    if (stored === '1' && window.innerWidth > 850) {
      this.el.classList.add('collapsed');
    }
  };

  /** Attach all event listeners. */
  Sidebar.prototype._bindEvents = function () {
    var self = this;

    if (this.collapseBtn) {
      U.on(this.collapseBtn, 'click', function () { self.toggle(); });
    }

    if (this.openBtn) {
      U.on(this.openBtn, 'click', function () { self.openMobile(); });
    }

    if (this.closeBtn) {
      U.on(this.closeBtn, 'click', function () { self.closeMobile(); });
    }

    if (this.overlay) {
      U.on(this.overlay, 'click', function () { self.closeMobile(); });
    }

    /* Close mobile sidebar on window resize to desktop */
    U.on(window, 'resize', U.debounce(function () {
      if (window.innerWidth > 850) {
        self.closeMobile();
      }
    }, 200));
  };

  /* ── Register on FCMB.modules ───────────────────────────── */
  FCMB.modules.Sidebar = Sidebar;

}(window.FCMB));
