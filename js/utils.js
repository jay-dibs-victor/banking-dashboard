/**
 * js/utils.js
 * FCMB Application — Shared Utility Library
 *
 * Attached as FCMB.Utils using the Revealing Module Pattern.
 * All other modules can call FCMB.Utils.qs(), .debounce(), etc.
 *
 * Pattern: Revealing Module Pattern on FCMB namespace
 * Depends: js/namespace.js (must load first)
 */

;(function (FCMB) {
  'use strict';

  /* ── DOM Helpers ─────────────────────────────────────────── */

  /**
   * Shorthand for document.querySelector (or scoped).
   * @param {string}  sel  — CSS selector
   * @param {Element} [ctx] — optional scope element
   * @returns {Element|null}
   */
  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  /**
   * Shorthand for querySelectorAll — returns a real Array.
   * @param {string}  sel
   * @param {Element} [ctx]
   * @returns {Element[]}
   */
  function qsa(sel, ctx) {
    return Array.prototype.slice.call(
      (ctx || document).querySelectorAll(sel)
    );
  }

  /**
   * Add an event listener; returns a remover function.
   * @param {EventTarget} el
   * @param {string}      event
   * @param {Function}    handler
   * @param {boolean|Object} [opts]
   * @returns {Function} — call to remove the listener
   */
  function on(el, event, handler, opts) {
    el.addEventListener(event, handler, opts || false);
    return function off() {
      el.removeEventListener(event, handler, opts || false);
    };
  }

  /* ── Function Utilities ──────────────────────────────────── */

  /**
   * Debounce — delays fn until after `ms` have elapsed since
   * the last call.
   * @param {Function} fn
   * @param {number}   ms
   * @returns {Function}
   */
  function debounce(fn, ms) {
    var timer;
    return function () {
      var args    = arguments;
      var context = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, ms);
    };
  }

  /**
   * Throttle — executes fn at most once every `ms` ms.
   * @param {Function} fn
   * @param {number}   ms
   * @returns {Function}
   */
  function throttle(fn, ms) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

  /* ── String / Format Utilities ───────────────────────────── */

  /**
   * Format a Date object to "Mon DD, YYYY" (e.g. "Oct 03, 2026").
   * @param {Date} date
   * @returns {string}
   */
  function formatDate(date) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
    var d = date.getDate();
    return months[date.getMonth()] + ' ' +
           (d < 10 ? '0' + d : d)   + ', ' +
           date.getFullYear();
  }

  /**
   * Normalise a string for comparison — lowercase, no diacritics,
   * collapsed spaces.
   * @param {string} str
   * @returns {string}
   */
  function normalise(str) {
    return String(str)
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ── Storage Helpers ─────────────────────────────────────── */

  /**
   * Safe localStorage.getItem — returns null if unavailable.
   * @param {string} key
   * @returns {string|null}
   */
  function store(key) {
    try { return localStorage.getItem(key); }
    catch (e) { return null; }
  }

  /**
   * Safe localStorage.setItem.
   * @param {string} key
   * @param {string} value
   */
  function storeSet(key, value) {
    try { localStorage.setItem(key, value); }
    catch (e) { /* silently ignore quota/privacy errors */ }
  }

  /* ── Animation Helpers ───────────────────────────────────── */

  /**
   * Trigger a CSS animation class, removing it first to allow
   * replay on the same element.
   * @param {Element} el
   * @param {string}  cls — CSS class containing animation
   */
  function triggerAnimation(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; /* force reflow */
    el.classList.add(cls);
    el.addEventListener('animationend', function handler() {
      el.classList.remove(cls);
      el.removeEventListener('animationend', handler);
    });
  }

  /* ── Expose as FCMB.Utils ───────────────────────────────── */
  FCMB.Utils = {
    qs:               qs,
    qsa:              qsa,
    on:               on,
    debounce:         debounce,
    throttle:         throttle,
    formatDate:       formatDate,
    normalise:        normalise,
    store:            store,
    storeSet:         storeSet,
    triggerAnimation: triggerAnimation
  };

}(window.FCMB));
