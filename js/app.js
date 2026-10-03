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

  /* ── Dashboard-v1 boot (dashboard.html — original element IDs) */
  register('dashboard-v1', function () {
    var U = FCMB.Utils;

    /* Sidebar maps to original IDs: #sidebarToggle + #mobileMenu */
    if (FCMB.modules.Sidebar) {
      new FCMB.modules.Sidebar({
        selector:       '#sidebar',
        collapseBtn:    '#sidebarToggle',
        mobileOpenBtn:  '#mobileMenu',
        mobileCloseBtn: null,
        overlay:        null,
        storageKey:     FCMB.config.storageKeys.sidebarCollapsed
      });
    }

    /* Calendar maps to original IDs: #dateTrigger + #dateLabel */
    if (FCMB.modules.Calendar) {
      new FCMB.modules.Calendar({
        triggerSelector: '#dateTrigger',
        pickerSelector:  '#datePicker',
        titleSelector:   null,
        daysSelector:    null,
        displaySelector: '#dateLabel',
        todayBtn:        null,
        closeBtn:        null
      });
    }

    /* Search maps to #searchPanel as results container */
    if (FCMB.Search) {
      FCMB.Search.init({
        inputSelector:   '#globalSearch',
        resultsSelector: '#searchPanel',
        buttonSelector:  '#searchButton',
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

    /* Nav-item active state (dashboard.html uses .nav-item not .side-link) */
    U.qsa('.nav-item').forEach(function (item) {
      item.addEventListener('click', function () {
        U.qsa('.nav-item').forEach(function (n) { n.classList.remove('active'); });
        item.classList.add('active');
      });
    });

    /* AI tabs */
    U.qsa('.ai-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        U.qsa('.ai-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
      });
    });

    /* Scroll fade-in via IntersectionObserver */
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      U.qsa('.fade-in-on-scroll').forEach(function (el) { observer.observe(el); });
    } else {
      U.qsa('.fade-in-on-scroll').forEach(function (el) { el.classList.add('visible'); });
    }
  });

  /* ── CFO Upload page boot (fcmb_cfo_performance_upload.html) ── */
  register('cfo-upload', function () {
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

    /* Search */
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

    /* Drag and Drop Dropzone Handlers */
    var dropzone = U.qs('#uploadDropzone');
    var fileInput = U.qs('#fileInput');
    var previewBox = U.qs('#filePreviewBox');
    var removeBtn = U.qs('#removeFileBtn');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', function () { fileInput.click(); });

      dropzone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });

      dropzone.addEventListener('dragleave', function () {
        dropzone.classList.remove('drag-over');
      });

      dropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
          handleFileSelected(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files.length) {
          handleFileSelected(fileInput.files[0]);
        }
      });

      if (removeBtn) {
        removeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          fileInput.value = '';
          if (previewBox) { previewBox.classList.remove('active'); }
        });
      }
    }

    function handleFileSelected(file) {
      if (!previewBox) return;
      var nameEl = U.qs('#previewFilename');
      var metaEl = U.qs('#previewMeta');
      if (nameEl) nameEl.textContent = file.name;
      if (metaEl) {
        var sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        metaEl.textContent = sizeMb + ' MB • ' + (file.type || 'Document') + ' • Pre-flight Passed';
      }
      previewBox.classList.add('active');
    }

    /* CFO Submit Modal Handler */
    var submitBtn = U.qs('#cfoSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        if (FCMB.Modal) { FCMB.Modal.show('#cfoSubmitModal'); }
      });
    }

    var confirmBtn = U.qs('#confirmIngestBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        if (FCMB.Modal) { FCMB.Modal.hide('#cfoSubmitModal'); }
        alert('CFO Financial Report Ingested Successfully! Audit record generated.');
      });
    }

    /* Detail Modal Triggers */
    U.qsa('.cfo-detail-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var title = btn.dataset.title || 'Financial Package';
        var details = btn.dataset.details || 'No additional details provided.';
        if (FCMB.Modal) {
          FCMB.Modal.showDetail(title, details, '#detailModal', '#detailTitle', '#detailBody');
        }
      });
    });
  });

  /* ── SPA Engine Integration ───────────────────────────── */
  function initSPA(options) {
    if (!FCMB.Router) {
      console.warn('[FCMB SPA] Router module (js/modules/Router.js) not loaded.');
      return;
    }

    options = options || {};
    var container = options.container || '#mainContent';

    /* Register SPA Routes */
    FCMB.Router.registerRoute('#/dashboard', {
      name: 'DashboardView',
      title: 'FCMB Executive Dashboard',
      containerSelector: container,
      template: function () {
        return document.querySelector('#tpl-dashboard') ? document.querySelector('#tpl-dashboard').innerHTML : '<div>Dashboard View</div>';
      },
      afterMount: function () {
        var bootFns = _pages['dashboard'] || [];
        bootFns.forEach(function (fn) { fn(); });
      }
    });

    FCMB.Router.registerRoute('#/cfo-upload', {
      name: 'CFOUploadView',
      title: 'FCMB CFO Financial Upload Portal',
      containerSelector: container,
      template: function () {
        return document.querySelector('#tpl-cfo-upload') ? document.querySelector('#tpl-cfo-upload').innerHTML : '<div>CFO Upload View</div>';
      },
      afterMount: function () {
        var bootFns = _pages['cfo-upload'] || [];
        bootFns.forEach(function (fn) { fn(); });
      }
    });

    /* Init Router Engine */
    FCMB.Router.init({
      defaultRoute: options.defaultRoute || '#/dashboard',
      container: container
    });
  }

  /* ── DOMContentLoaded — run matching page boots ─────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.dataset.page || '';
    var mode = document.body.dataset.mode || '';

    if (mode === 'spa') {
      initSPA();
    } else {
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
    }
  });

  /* ── Expose register & initSPA so external files can extend ────── */
  FCMB.App = {
    register: register,
    initSPA: initSPA
  };

}(window.FCMB));
