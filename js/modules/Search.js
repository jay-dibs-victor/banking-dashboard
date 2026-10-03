/**
 * js/modules/Search.js
 * FCMB Application — Global Search Module
 *
 * Handles: keystroke filtering of searchable items,
 *          result panel render & open/close,
 *          keyboard navigation (Escape to close).
 *
 * Pattern: Revealing Module Pattern on FCMB namespace
 * Attached as: FCMB.Search
 * Depends: namespace.js, utils.js
 */

;(function (FCMB) {
  'use strict';

  var U = FCMB.Utils;

  /* ── Private state ───────────────────────────────────────── */
  var _input   = null;
  var _results = null;
  var _items   = [];
  var _onSelect = null;

  /* ── Private helpers ─────────────────────────────────────── */

  /**
   * Filter _items by query and render into _results panel.
   * @param {string} q — raw query string
   */
  function _render(q) {
    var query = U.normalise(q);

    if (!query) {
      _close();
      return;
    }

    var matched = _items.filter(function (item) {
      return U.normalise(item.title).indexOf(query) !== -1 ||
             U.normalise(item.type  || '').indexOf(query) !== -1;
    });

    if (!matched.length) {
      _results.innerHTML =
        '<div class="search-result-item"><span class="result-title">No results for &ldquo;' +
        q + '&rdquo;</span></div>';
      _results.classList.add('open');
      return;
    }

    var html = matched.slice(0, 8).map(function (item) {
      return '<div class="search-result-item" tabindex="0" data-idx="' +
        _items.indexOf(item) + '">' +
        '<span class="result-title">' + item.title + '</span>' +
        '<span class="result-type">'  + (item.type || '') + '</span>' +
        '</div>';
    }).join('');

    _results.innerHTML = html;
    _results.classList.add('open');

    /* Bind click & keyboard on each result */
    U.qsa('.search-result-item[data-idx]', _results).forEach(function (row) {
      function _activate() {
        var idx  = parseInt(row.dataset.idx, 10);
        var item = _items[idx];
        if (item && typeof item.action === 'function') { item.action(); }
        if (typeof _onSelect === 'function') { _onSelect(item); }
        _close();
        _input.value = '';
      }
      U.on(row, 'click',   _activate);
      U.on(row, 'keydown', function (e) {
        if (e.key === 'Enter') { _activate(); }
      });
    });
  }

  function _close() {
    if (_results) { _results.classList.remove('open'); }
  }

  function _open() {
    if (_results && _input && _input.value.trim()) {
      _render(_input.value);
    }
  }

  /* ── Public API ──────────────────────────────────────────── */

  /**
   * Initialise the search module.
   * @param {Object}   config
   * @param {string}   config.inputSelector    — text input
   * @param {string}   config.resultsSelector  — results panel
   * @param {string}   [config.buttonSelector] — search icon btn
   * @param {Array}    config.items            — searchable items
   * @param {Function} [config.onSelect]       — called with selected item
   */
  function init(config) {
    _input    = U.qs(config.inputSelector);
    _results  = U.qs(config.resultsSelector);
    _items    = config.items || [];
    _onSelect = config.onSelect || null;

    if (!_input || !_results) {
      console.warn('[Search] required elements not found');
      return;
    }

    /* Debounced input handler */
    U.on(_input, 'input', U.debounce(function () {
      _render(_input.value);
    }, 220));

    /* Search button click */
    var btn = config.buttonSelector ? U.qs(config.buttonSelector) : null;
    if (btn) { U.on(btn, 'click', _open); }

    /* Escape closes panel */
    U.on(document, 'keydown', function (e) {
      if (e.key === 'Escape') { _close(); }
    });

    /* Outside click closes panel */
    U.on(document, 'click', function (e) {
      if (!_results.contains(e.target) && e.target !== _input) {
        _close();
      }
    });
  }

  /** Add items to the search registry at runtime. */
  function addItems(items) {
    _items = _items.concat(items);
  }

  /* ── Attach to FCMB namespace ───────────────────────────── */
  FCMB.Search = { init: init, addItems: addItems, close: _close };

}(window.FCMB));
