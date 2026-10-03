/**
 * js/modules/Login.js
 * FCMB Application — Two-Step Login Module
 *
 * Two-step flow: email → Continue → password reveals → Login.
 * Form validation, password toggle, spinner, forgot password.
 *
 * Pattern: Revealing Module Pattern on FCMB namespace
 * Attached as: FCMB.Login
 * Depends: namespace.js, utils.js
 */

;(function (FCMB) {
  'use strict';

  var U = FCMB.Utils;

  /* ── Private state ───────────────────────────────────────── */
  var _step = 1;
  var DOM   = {};

  /* ── Private helpers ─────────────────────────────────────── */

  function _isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function _shakeCard() {
    U.triggerAnimation(U.qs('.login-card'), 'shake');
  }

  /* ── Step transitions ────────────────────────────────────── */

  function _revealPassword() {
    _step = 2;
    DOM.passwordGroup.classList.add('visible');
    DOM.button.textContent = 'Login';
    if (DOM.subtitle) {
      DOM.subtitle.textContent = 'Enter your password to sign in';
    }
    DOM.password.setAttribute('required', '');
    DOM.password.setAttribute('minlength', '6');
    setTimeout(function () { DOM.password.focus(); }, 360);
  }

  /* ── Event handlers ──────────────────────────────────────── */

  function _handleToggle() {
    var hidden = DOM.password.type === 'password';
    DOM.password.type = hidden ? 'text' : 'password';
    DOM.toggle.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
    DOM.toggle.innerHTML = hidden
      ? '<i class="fas fa-eye-slash"></i>'
      : '<i class="fas fa-eye"></i>';
  }

  function _handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (_step === 1) {
      if (!_isValidEmail(DOM.email.value)) {
        DOM.form.classList.add('was-validated');
        _shakeCard();
        return;
      }
      DOM.form.classList.remove('was-validated');
      _revealPassword();
      return;
    }

    if (!DOM.form.checkValidity()) {
      DOM.form.classList.add('was-validated');
      _shakeCard();
      return;
    }

    DOM.button.disabled = true;
    DOM.button.innerHTML =
      '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Signing in…';

    /* Replace with real auth API call */
    setTimeout(function () {
      DOM.button.disabled  = false;
      DOM.button.textContent = 'Login';
      alert('Connect this form to your authentication endpoint.');
    }, 700);
  }

  function _handleForgot(e) {
    e.preventDefault();
    alert('Connect this link to your password recovery flow.');
  }

  /* ── Public init ─────────────────────────────────────────── */

  function init() {
    DOM.form          = U.qs('#loginForm');
    DOM.email         = U.qs('#email');
    DOM.password      = U.qs('#password');
    DOM.toggle        = U.qs('#togglePassword');
    DOM.forgot        = U.qs('#forgotPassword');
    DOM.button        = U.qs('#loginButton');
    DOM.passwordGroup = U.qs('#passwordGroup');
    DOM.subtitle      = U.qs('#loginSubtitle');

    if (!DOM.form) { return; }

    U.on(DOM.toggle, 'click',  _handleToggle);
    U.on(DOM.forgot, 'click',  _handleForgot);
    U.on(DOM.form,   'submit', _handleSubmit);

    /* Enter on email field advances step */
    U.on(DOM.email, 'keydown', function (e) {
      if (e.key === 'Enter' && _step === 1) {
        e.preventDefault();
        DOM.form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
  }

  FCMB.Login = { init: init };

}(window.FCMB));
