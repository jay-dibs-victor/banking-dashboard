/**
 * js/app.js
 * FCMB Application — Page-Aware Bootstrap Entry Point
 *
 * Detects the current page via `document.body.dataset.page`
 * and boots the appropriate modules.
 *
 * Script load order (all pages):
 *   1. namespace.js   — window.FCMB
 *   2. utils.js       — FCMB.Utils
 *   3. modules/*.js   — prototype classes + RMP modules
 *   4. app.js         — this file, boots on DOMContentLoaded
 *
 * Pattern: Page-aware bootstrap using FCMB namespace
 * Depends: namespace.js, utils.js, all modules/*.js
 */

;(function (FCMB) {
  'use strict';

  /* ── Internal registry of boot functions per page ───────── */
  var _pages = {};

  /**
   * Register a boot function for a named page.
   * Modules call this from their own files to declare their
   * init without coupling to app.js internals.
   *
   * @param {string}   pageName  — matches data-page="..." on <body>
   * @param {Function} bootFn    — called on DOMContentLoaded
   */
  function register(pageName, bootFn) {
    if (!_pages[pageName]) { _pages[pageName] = []; }
    _pages[pageName].push(bootFn);
  }

  /* ── Dashboard page boot ─────────────────────────────────── */
  register('dashboard', function () {
    var U = FCMB.Utils;

    /* Sidebar */
    if (FCMB.modules.Sidebar) {
      new FCMB.modules.Sidebar({
        selector:       '#sidebar',
        collapseBtn:    '#collapseSidebar',
        mobileOpenBtn:  '#mobileSidebarOpen',
        mobileCloseBtn: '#mobileSidebarClose',
        overlay:        '#sidebarOverlay',
        storageKey:     FCMB.config.storageKeys.sidebarCollapsed
      });
    }

    /* Calendar */
    if (FCMB.modules.Calendar) {
      new FCMB.modules.Calendar({
        triggerSelector: '#dateButton',
        pickerSelector:  '#datePicker',
        titleSelector:   '#calendarTitle',
        daysSelector:    '#calendarDays',
        displaySelector: '#currentDate',
        todayBtn:        '#todayButton',
        closeBtn:        '#closeDate'
      });
    }

    /* Global search */
    if (FCMB.Search) {
      FCMB.Search.init({
        inputSelector:   '#globalSearch',
        buttonSelector:  '#searchButton',
        resultsSelector: '#searchResults',
        items:           FCMB.config.searchItems
      });
    }

    /* Theme toggle */
    if (FCMB.Theme) {
      FCMB.Theme.init({
        toggleSelector: '#themeToggle',
        storageKey:     FCMB.config.storageKeys.theme
      });
    }

    /* Access modal save handler */
    var saveBtn = U.qs('#saveAccess');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        if (FCMB.Modal) { FCMB.Modal.hide('#accessModal'); }
        /* Extend: persist access settings to server here */
      });
    }

    /* Sidebar nav active link routing */
    U.qsa('.side-link').forEach(function (link) {
      link.addEventListener('click', function () {
        U.qsa('.side-link').forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      });
    });
  });

  /* ── Login page boot ──────────────────────────────────────── */
  register('login', function () {
    if (FCMB.Login) {
      FCMB.Login.init();
    }
  });

  /* ── DOMContentLoaded — run matching page boots ─────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.dataset.page || '';
    var boots = _pages[page] || [];

    boots.forEach(function (fn) {
      try {
        fn();
      } catch (err) {
        if (typeof console !== 'undefined') {
          console.error('[FCMB] Boot error on page "' + page + '":', err);
        }
      }
    });
  });

  /* ── Expose register so external files can extend ───────── */
  FCMB.App = { register: register };

}(window.FCMB));
