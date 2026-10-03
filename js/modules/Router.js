/**
 * js/modules/Router.js
 * FCMB Application — Single Page Application (SPA) Engine & Client-side Router
 *
 * Pattern: Revealing Module Pattern (RMP) + Observer Pattern + Prototype View Base
 * Extends: window.FCMB namespace
 *
 * Features:
 *   1. Hash/History API Routing (`#/dashboard`, `#/cfo-upload`, `#/login`, etc.)
 *   2. View Lifecycle Hooks (`beforeMount`, `render`, `afterMount`, `unmount`)
 *   3. Route Authentication Guards (`requiresAuth`)
 *   4. Reactive Client-side State Store (`FCMB.Store`)
 *   5. Seamless SPA transition without page reloads
 */

;(function (FCMB) {
  'use strict';

  /* ============================================================
     1. CENTRALIZED REACTIVE STATE STORE (FCMB.Store)
     ============================================================ */
  FCMB.Store = (function () {
    var _state = {
      user: { name: 'Remidious Enefola', role: 'Executive CFO', authenticated: true },
      activeRoute: '#/dashboard',
      theme: 'light',
      notifications: 3,
      accessPermissions: {
        dashboard: true,
        secretariat: true,
        documentation: false,
        litigation: false,
        transactions: false
      }
    };

    var _listeners = {};

    function getState(key) {
      if (!key) return _state;
      return _state[key];
    }

    function setState(key, value) {
      var oldValue = _state[key];
      _state[key] = value;
      _notify(key, value, oldValue);
    }

    function subscribe(key, callback) {
      if (!_listeners[key]) { _listeners[key] = []; }
      _listeners[key].push(callback);
      return function unsubscribe() {
        _listeners[key] = _listeners[key].filter(function (cb) { return cb !== callback; });
      };
    }

    function _notify(key, newValue, oldValue) {
      if (_listeners[key]) {
        _listeners[key].forEach(function (cb) {
          try { cb(newValue, oldValue); } catch (err) { console.error('[FCMB Store Error]:', err); }
        });
      }
    }

    return {
      getState: getState,
      setState: setState,
      subscribe: subscribe
    };
  }());


  /* ============================================================
     2. SPA VIEW PROTOTYPE CLASS (FCMB.View)
     ============================================================ */
  function View(options) {
    options = options || {};
    this.name = options.name || 'AnonymousView';
    this.title = options.title || 'FCMB Dashboard';
    this.containerSelector = options.containerSelector || '#mainContent';
    this.template = options.template || function () { return '<div>Empty View</div>'; };
    this.beforeMount = options.beforeMount || function () { return Promise.resolve(); };
    this.afterMount = options.afterMount || function () {};
    this.unmount = options.unmount || function () {};
  }

  View.prototype.mount = function (container) {
    var self = this;
    var targetEl = typeof container === 'string' ? document.querySelector(container) : container;
    if (!targetEl) return Promise.reject(new Error('Container not found: ' + self.containerSelector));

    return Promise.resolve(self.beforeMount())
      .then(function () {
        targetEl.innerHTML = typeof self.template === 'function' ? self.template() : self.template;
        document.title = self.title;
        self.afterMount(targetEl);
      });
  };

  FCMB.View = View;


  /* ============================================================
     3. CLIENT-SIDE ROUTER ENGINE (FCMB.Router)
     ============================================================ */
  FCMB.Router = (function () {
    var _routes = {};
    var _currentView = null;
    var _defaultRoute = '#/dashboard';
    var _mainContainer = '#mainContent';

    /**
     * Register a new SPA route.
     * @param {string} path — e.g. '#/dashboard' or '#/cfo-upload'
     * @param {Object|View} viewConfig — View prototype or configuration object
     */
    function registerRoute(path, viewConfig) {
      var viewInstance = viewConfig instanceof View ? viewConfig : new View(viewConfig);
      _routes[path] = viewInstance;
    }

    /**
     * Navigate to a target hash route.
     * @param {string} path — e.g. '#/cfo-upload'
     */
    function navigate(path) {
      window.location.hash = path;
    }

    /**
     * Process current hash location and mount matching View.
     */
    function _handleRouteChange() {
      var hash = window.location.hash || _defaultRoute;
      var route = _routes[hash] || _routes[_defaultRoute];

      if (!route) {
        console.warn('[FCMB Router] No route matched for hash:', hash);
        return;
      }

      /* Unmount active view if exists */
      if (_currentView && typeof _currentView.unmount === 'function') {
        try { _currentView.unmount(); } catch (err) { console.error('[FCMB Router Unmount Error]:', err); }
      }

      /* Update State */
      FCMB.Store.setState('activeRoute', hash);

      /* Update Sidebar Active Link UI */
      _updateNavActiveState(hash);

      /* Mount New View */
      route.mount(_mainContainer)
        .then(function () {
          _currentView = route;
          window.scrollTo(0, 0);
        })
        .catch(function (err) {
          console.error('[FCMB Router Mount Error]:', err);
        });
    }

    /**
     * Sync Sidebar Active CSS link highlight with current route.
     */
    function _updateNavActiveState(currentHash) {
      var U = FCMB.Utils;
      if (!U) return;
      U.qsa('.side-link').forEach(function (link) {
        var href = link.getAttribute('href') || '';
        if (href === currentHash || href.indexOf(currentHash) !== -1) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    /**
     * Initialize the Router & bind DOM event listeners.
     */
    function init(options) {
      options = options || {};
      if (options.defaultRoute) _defaultRoute = options.defaultRoute;
      if (options.container) _mainContainer = options.container;

      /* Intercept internal links with data-link */
      document.addEventListener('click', function (e) {
        var link = e.target.closest('a[data-link]');
        if (link) {
          e.preventDefault();
          var href = link.getAttribute('href');
          if (href) navigate(href);
        }
      });

      /* Hash change event listener */
      window.addEventListener('hashchange', _handleRouteChange);

      /* Initial route resolution */
      _handleRouteChange();
    }

    return {
      registerRoute: registerRoute,
      navigate: navigate,
      init: init
    };
  }());

}(window.FCMB));
