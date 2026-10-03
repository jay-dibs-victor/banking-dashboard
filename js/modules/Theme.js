/**
 * js/modules/Theme.js
 * FCMB Application — Dark / Light Theme Toggle
 *
 * Applies `data-theme="dark"` on <html>, persists to localStorage.
 *
 * Pattern: Revealing Module Pattern on FCMB namespace
 * Attached as: FCMB.Theme
 * Depends: namespace.js, utils.js
 */

;(function (FCMB) {
  'use strict';

  var U   = FCMB.Utils;
  var _btn = null;
  var _key = 'fcmb-theme';

  /* ── Private ─────────────────────────────────────────────── */

  function _isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function _apply(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    U.storeSet(_key, dark ? 'dark' : 'light');
    _updateIcon(dark);
  }

  function _updateIcon(dark) {
    if (!_btn) { return; }
    _btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    var icon = U.qs('i', _btn);
    if (icon) {
      icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  /* ── Public API ──────────────────────────────────────────── */

  function init(config) {
    config  = config || {};
    _key    = config.storageKey || _key;
    _btn    = config.toggleSelector ? U.qs(config.toggleSelector) : null;

    /* Restore persisted preference */
    var stored = U.store(_key);
    var prefersDark = stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    _apply(prefersDark);

    if (_btn) {
      U.on(_btn, 'click', function () { _apply(!_isDark()); });
    }
  }

  function setDark()  { _apply(true);  }
  function setLight() { _apply(false); }
  function toggle()   { _apply(!_isDark()); }

  FCMB.Theme = { init: init, setDark: setDark, setLight: setLight, toggle: toggle };

}(window.FCMB));


/**
 * js/modules/Modal.js
 * FCMB Application — Modal Helper
 *
 * Thin wrapper around Bootstrap 4 modal API with a helper to
 * inject dynamic content into a detail modal body.
 *
 * Pattern: Revealing Module Pattern on FCMB namespace
 * Attached as: FCMB.Modal
 * Depends: namespace.js, utils.js, Bootstrap 4 jQuery plugin
 */

;(function (FCMB) {
  'use strict';

  var U = FCMB.Utils;

  /* ── Public API ──────────────────────────────────────────── */

  /** Show a Bootstrap modal by selector. */
  function show(selector) {
    var el = U.qs(selector);
    if (el && window.$) { $(el).modal('show'); }
  }

  /** Hide a Bootstrap modal by selector. */
  function hide(selector) {
    var el = U.qs(selector);
    if (el && window.$) { $(el).modal('hide'); }
  }

  /**
   * Open the detail modal and inject a title + body HTML.
   * @param {string} title    — modal heading text
   * @param {string} bodyHtml — inner HTML for modal body
   */
  function showDetail(title, bodyHtml) {
    var titleEl = U.qs('#detailTitle');
    var bodyEl  = U.qs('#detailBody');
    if (titleEl) { titleEl.textContent = title; }
    if (bodyEl)  { bodyEl.innerHTML    = bodyHtml; }
    show('#detailModal');
  }

  FCMB.Modal = { show: show, hide: hide, showDetail: showDetail };

}(window.FCMB));
