/**
 * js/modules/Calendar.js
 * FCMB Application — Calendar / Date Picker Module
 *
 * Handles: popover toggle, month navigation, day grid render,
 *          date selection, display label update.
 *
 * Pattern: Prototype (Constructor + Prototype methods)
 * Registered on: FCMB.modules.Calendar
 * Depends: namespace.js, utils.js
 */

;(function (FCMB) {
  'use strict';

  var U = FCMB.Utils;

  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  var DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  /* ══════════════════════════════════════════════════════════
     Constructor
     ══════════════════════════════════════════════════════════ */

  /**
   * @param {Object} opts
   * @param {string} opts.triggerSelector  — button that opens picker
   * @param {string} opts.pickerSelector   — the popover container
   * @param {string} opts.titleSelector    — month/year heading
   * @param {string} opts.daysSelector     — grid container
   * @param {string} opts.displaySelector  — topbar date label
   * @param {string} [opts.todayBtn]       — "Today" button selector
   * @param {string} [opts.closeBtn]       — close button selector
   */
  function Calendar(opts) {
    this.trigger  = U.qs(opts.triggerSelector);
    this.picker   = U.qs(opts.pickerSelector);
    this.title    = U.qs(opts.titleSelector);
    this.daysEl   = U.qs(opts.daysSelector);
    this.display  = U.qs(opts.displaySelector);
    this.todayBtn = U.qs(opts.todayBtn || '#todayButton');
    this.closeBtn = U.qs(opts.closeBtn || '#closeDate');

    var now = new Date();
    this._viewDate     = new Date(now.getFullYear(), now.getMonth(), 1);
    this._selectedDate = new Date(now);

    if (!this.picker) {
      console.warn('[Calendar] picker element not found:', opts.pickerSelector);
      return;
    }

    this._render();
    this._bindEvents();
    this._updateDisplay();
  }

  /* ══════════════════════════════════════════════════════════
     Prototype methods
     ══════════════════════════════════════════════════════════ */

  /** Open the date picker popover. */
  Calendar.prototype.open = function () {
    this.picker.classList.add('open');
  };

  /** Close the date picker popover. */
  Calendar.prototype.close = function () {
    this.picker.classList.remove('open');
  };

  /** Toggle the date picker. */
  Calendar.prototype.toggle = function () {
    if (this.picker.classList.contains('open')) {
      this.close();
    } else {
      this.open();
    }
  };

  /** Navigate to the previous month and re-render. */
  Calendar.prototype.prevMonth = function () {
    this._viewDate.setMonth(this._viewDate.getMonth() - 1);
    this._render();
  };

  /** Navigate to the next month and re-render. */
  Calendar.prototype.nextMonth = function () {
    this._viewDate.setMonth(this._viewDate.getMonth() + 1);
    this._render();
  };

  /** Select a date, update display, close picker. */
  Calendar.prototype.selectDate = function (date) {
    this._selectedDate = new Date(date);
    U.storeSet(FCMB.config.storageKeys.selectedDate, date.toISOString());
    this._render();
    this._updateDisplay();
    this.close();
  };

  /** Jump to today. */
  Calendar.prototype.goToday = function () {
    var now = new Date();
    this._viewDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.selectDate(now);
  };

  /* ── Private ─────────────────────────────────────────────── */

  /** Render month title + day grid into the DOM. */
  Calendar.prototype._render = function () {
    var v   = this._viewDate;
    var sel = this._selectedDate;
    var now = new Date();

    /* Title */
    if (this.title) {
      this.title.textContent = MONTHS[v.getMonth()] + ' ' + v.getFullYear();
    }

    if (!this.daysEl) { return; }

    var html = '';

    /* Day name headers */
    DAY_NAMES.forEach(function (d) {
      html += '<span class="cal-day-name">' + d + '</span>';
    });

    /* Blank cells before first day of month */
    var firstDay  = new Date(v.getFullYear(), v.getMonth(), 1).getDay();
    var daysInMonth = new Date(v.getFullYear(), v.getMonth() + 1, 0).getDate();

    for (var b = 0; b < firstDay; b++) {
      html += '<span class="cal-day other"></span>';
    }

    /* Day cells */
    for (var d = 1; d <= daysInMonth; d++) {
      var cls = 'cal-day';
      var isToday = (d === now.getDate() &&
                     v.getMonth() === now.getMonth() &&
                     v.getFullYear() === now.getFullYear());
      var isSelected = (d === sel.getDate() &&
                        v.getMonth() === sel.getMonth() &&
                        v.getFullYear() === sel.getFullYear());

      if (isToday)    { cls += ' today'; }
      if (isSelected) { cls += ' selected'; }

      html += '<span class="' + cls + '" data-day="' + d + '">' + d + '</span>';
    }

    this.daysEl.innerHTML = html;

    /* Click handler on day cells */
    var self = this;
    U.qsa('.cal-day[data-day]', this.daysEl).forEach(function (cell) {
      U.on(cell, 'click', function () {
        var day   = parseInt(cell.dataset.day, 10);
        var date  = new Date(v.getFullYear(), v.getMonth(), day);
        self.selectDate(date);
      });
    });
  };

  /** Update the topbar date display label. */
  Calendar.prototype._updateDisplay = function () {
    if (this.display) {
      this.display.textContent = U.formatDate(this._selectedDate);
    }
  };

  /** Bind toggle, nav, today, close, outside-click events. */
  Calendar.prototype._bindEvents = function () {
    var self = this;

    if (this.trigger) {
      U.on(this.trigger, 'click', function (e) {
        e.stopPropagation();
        self.toggle();
      });
    }

    /* Previous/next month nav buttons inside picker */
    var prevBtn = U.qs('#calPrev', this.picker);
    var nextBtn = U.qs('#calNext', this.picker);
    if (prevBtn) { U.on(prevBtn, 'click', function () { self.prevMonth(); }); }
    if (nextBtn) { U.on(nextBtn, 'click', function () { self.nextMonth(); }); }

    if (this.todayBtn) {
      U.on(this.todayBtn, 'click', function () { self.goToday(); });
    }

    if (this.closeBtn) {
      U.on(this.closeBtn, 'click', function () { self.close(); });
    }

    /* Close on outside click */
    U.on(document, 'click', function (e) {
      if (self.picker && !self.picker.contains(e.target) &&
          self.trigger && !self.trigger.contains(e.target)) {
        self.close();
      }
    });
  };

  /* ── Register on FCMB.modules ───────────────────────────── */
  FCMB.modules.Calendar = Calendar;

}(window.FCMB));
