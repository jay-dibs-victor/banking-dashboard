/**
 * js/namespace.js
 * FCMB Application — Global Namespace Setup
 *
 * Establishes the single top-level `FCMB` object on `window`
 * so every subsequent module can attach to it without polluting
 * the global scope.
 *
 * Pattern: Namespace Object + Config Literal
 */

;(function (global) {
  'use strict';

  /* ── Guard: only initialise once ────────────────────────── */
  if (global.FCMB) { return; }

  /* ── Global namespace ───────────────────────────────────── */
  global.FCMB = {

    /* Application metadata */
    config: {
      version:    '2.0.0',
      brand:      'FCMB Data Science Group',
      buildDate:  '2026-10-03',

      /* Keys used for localStorage persistence */
      storageKeys: {
        sidebarCollapsed: 'fcmb-sidebar-collapsed',
        theme:            'fcmb-theme',
        selectedDate:     'fcmb-selected-date'
      },

      /* Searchable items registry — populated per page via app.js */
      searchItems: []
    },

    /**
     * Sub-namespaces registered by individual module files.
     * Each module does: FCMB.modules.Sidebar = Sidebar;
     */
    modules: {},

    /**
     * RMP modules attach directly on FCMB:
     *   FCMB.Search = (function(){ ... }());
     *   FCMB.Theme  = (function(){ ... }());
     */
  };

  /* ── Dev helper: log namespace on load in development ───── */
  if (typeof console !== 'undefined' && window.location.hostname === 'localhost') {
    console.info('[FCMB] Namespace initialised — v' + global.FCMB.config.version);
  }

}(window));
