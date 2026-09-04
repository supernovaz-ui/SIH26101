(() => {
  "use strict";

  /* ========================================================================
     1. CONFIG & CONSTANTS
     ======================================================================== */

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const PASSWORD_RULES = {
    minLength: { test: (v) => v.length >= 8, label: "At least 8 characters" },
    uppercase: { test: (v) => /[A-Z]/.test(v), label: "At least 1 uppercase letter" },
    lowercase: { test: (v) => /[a-z]/.test(v), label: "At least 1 lowercase letter" },
    number: { test: (v) => /[0-9]/.test(v), label: "At least 1 number" },
    special: { test: (v) => /[^A-Za-z0-9]/.test(v), label: "At least 1 special character" },
  };

  // Simulated network delay for the prototype auth calls (ms).
  const SIMULATED_AUTH_DELAY = 1200;

  /* ========================================================================
     2. DOM REFERENCES
     ======================================================================== */

  const authTitle = document.getElementById("auth-title");
  const authSubtitle = document.getElementById("auth-subtitle");

  const loginToggleBtn = document.getElementById("login-toggle");
  const registerToggleBtn = document.getElementById("register-toggle");

  const loginForm = document.querySelector(".login-container");
  const registerForm = document.querySelector(".register-container");

  // Login fields
  const loginEmailInput = document.getElementById("login-email");
  const loginPasswordInput = document.getElementById("login-password");
  const loginBtn = document.getElementById("login-btn");

  // Register fields
  const registerNameInput = document.getElementById("register-name");
  const registerEmailInput = document.getElementById("register-email");
  const registerPasswordInput = document.getElementById("register-password");
  const registerConfirmPasswordInput = document.getElementById("register-confirm-password");
  const registerBtn = document.getElementById("register-btn");

  // Optional elements — these may not exist in the current HTML yet.
  // Every usage below is guarded with existence checks so the script
  // degrades gracefully until the corresponding markup is added.
  const passwordRequirementsList = document.querySelector(".password-requirements");
  const googleSignInBtn = document.querySelector(".google-btn, #google-signin-btn");
  const forgotPasswordLink = document.querySelector(".forgot-password");

  /* ========================================================================
     3. GENERIC UI STATE HELPERS
     ======================================================================== */

  /**
   * Applies a single validation state class to a field, clearing the others.
   * @param {HTMLElement} field
   * @param {"valid"|"invalid"|null} state
   */
  function setFieldState(field, state) {
    if (!field) return;
    field.classList.remove("valid", "invalid");
    if (state) field.classList.add(state);

    // Don't rely on color alone — mirror the state in an ARIA attribute too.
    if (state === "invalid") {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  /** Clears any validation state from a field (used for empty/untouched fields). */
  function clearFieldState(field) {
    if (!field) return;
    field.classList.remove("valid", "invalid");
    field.removeAttribute("aria-invalid");
  }

  /**
   * Enables or disables a field and keeps the `.disabled` class (used by the
   * CSS alongside the native `:disabled` selector) in sync.
   */
  function setFieldEnabled(field, isEnabled) {
    if (!field) return;
    field.disabled = !isEnabled;
    field.classList.toggle("disabled", !isEnabled);
    if (!isEnabled) {
      clearFieldState(field);
    }
  }

  /** Puts a submit button into its loading state. */
  function setButtonLoading(button, loadingText) {
    if (!button) return;
    button.dataset.originalText = button.dataset.originalText || button.textContent;
    button.textContent = loadingText;
    button.classList.add("loading");
    button.disabled = true;
  }

  /** Restores a submit button from its loading state. */
  function resetButtonLoading(button) {
    if (!button) return;
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
    }
    button.classList.remove("loading");
    button.disabled = false;
  }

  /* ========================================================================
     4. VALIDATORS
     ======================================================================== */

  function isEmailValid(value) {
    return EMAIL_REGEX.test(value.trim());
  }

  function isNotEmpty(value) {
    return value.trim().length > 0;
  }

  /** Returns which password rules are currently satisfied. */
  function evaluatePasswordRules(value) {
    const results = {};
    Object.keys(PASSWORD_RULES).forEach((key) => {
      results[key] = PASSWORD_RULES[key].test(value);
    });
    return results;
  }

  function isPasswordFullyValid(value) {
    const results = evaluatePasswordRules(value);
    return Object.values(results).every(Boolean);
  }

  /* ========================================================================
     5. LOGIN / REGISTER TOGGLE
     ======================================================================== */

  const COPY = {
    login: {
      title: "Welcome to SIH26101",
      subtitle: "Please login or register to continue.",
    },
    register: {
      title: "Create your SIH26101 account",
      subtitle: "Fill in your details to get started.",
    },
  };

  function showLogin() {
    loginToggleBtn.classList.add("active");
    registerToggleBtn.classList.remove("active");
    loginToggleBtn.setAttribute("aria-selected", "true");
    registerToggleBtn.setAttribute("aria-selected", "false");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    authTitle.textContent = COPY.login.title;
    authSubtitle.textContent = COPY.login.subtitle;
  }

  function showRegister() {
    registerToggleBtn.classList.add("active");
    loginToggleBtn.classList.remove("active");
    registerToggleBtn.setAttribute("aria-selected", "true");
    loginToggleBtn.setAttribute("aria-selected", "false");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    authTitle.textContent = COPY.register.title;
    authSubtitle.textContent = COPY.register.subtitle;
  }

  function initToggle() {
    loginToggleBtn.addEventListener("click", showLogin);
    registerToggleBtn.addEventListener("click", showRegister);
    // Login is active by default, matching the existing HTML markup.
  }

  /* ========================================================================
     6. LOGIN FORM LOGIC
     ======================================================================== */

  function validateLoginEmailField() {
    const value = loginEmailInput.value;
    if (!isNotEmpty(value)) {
      clearFieldState(loginEmailInput);
      return false;
    }
    const valid = isEmailValid(value);
    setFieldState(loginEmailInput, valid ? "valid" : "invalid");
    return valid;
  }

  function validateLoginPasswordField() {
    const value = loginPasswordInput.value;
    if (!isNotEmpty(value)) {
      clearFieldState(loginPasswordInput);
      return false;
    }
    setFieldState(loginPasswordInput, "valid");
    return true;
  }

  function isLoginFormValid() {
    const emailValid = isEmailValid(loginEmailInput.value);
    const passwordValid = isNotEmpty(loginPasswordInput.value);
    return emailValid && passwordValid;
  }

  function initLoginFormValidation() {
    loginEmailInput.addEventListener("input", validateLoginEmailField);
    loginPasswordInput.addEventListener("input", validateLoginPasswordField);
  }

  /* ========================================================================
     7. REGISTER FORM — SEQUENTIAL FIELD GATING
     ======================================================================== */

  /**
   * Enforces the required order: Name -> Email -> Password -> Confirm Password.
   * Each step only unlocks the next once the current field is valid, and
   * re-locks (and resets) everything downstream if an earlier field becomes
   * invalid again.
   */
  function updateSequentialGating() {
    const nameValid = isNotEmpty(registerNameInput.value);

    // Email depends on Name.
    setFieldEnabled(registerEmailInput, nameValid);

    const emailValid = nameValid && isEmailValid(registerEmailInput.value);

    // Password depends on Email.
    setFieldEnabled(registerPasswordInput, emailValid);

    const passwordValid = emailValid && isPasswordFullyValid(registerPasswordInput.value);

    // Confirm Password depends on Password satisfying every requirement.
    setFieldEnabled(registerConfirmPasswordInput, passwordValid);

    if (!passwordValid) {
      // Password no longer fully valid — reset anything downstream.
      registerPasswordInput.classList.remove("requirements-met");
      clearFieldState(registerConfirmPasswordInput);
    }

    updateRegisterSubmitAvailability();
  }

  function updateRegisterSubmitAvailability() {
    if (!registerBtn) return;
    registerBtn.disabled = !isRegisterFormValid();
  }

  function isRegisterFormValid() {
    const nameValid = isNotEmpty(registerNameInput.value);
    const emailValid = isEmailValid(registerEmailInput.value);
    const passwordValid = isPasswordFullyValid(registerPasswordInput.value);
    const confirmValid =
      registerConfirmPasswordInput.value.length > 0 &&
      registerConfirmPasswordInput.value === registerPasswordInput.value;

    return nameValid && emailValid && passwordValid && confirmValid;
  }

  function validateRegisterNameField() {
    const value = registerNameInput.value;
    if (!isNotEmpty(value)) {
      clearFieldState(registerNameInput);
    } else {
      setFieldState(registerNameInput, "valid");
    }
    updateSequentialGating();
  }

  function validateRegisterEmailField() {
    const value = registerEmailInput.value;
    if (!isNotEmpty(value)) {
      clearFieldState(registerEmailInput);
    } else {
      setFieldState(registerEmailInput, isEmailValid(value) ? "valid" : "invalid");
    }
    updateSequentialGating();
  }

  function initSequentialGating() {
    // Start state: only Full Name is enabled.
    setFieldEnabled(registerEmailInput, false);
    setFieldEnabled(registerPasswordInput, false);
    setFieldEnabled(registerConfirmPasswordInput, false);
    updateRegisterSubmitAvailability();

    registerNameInput.addEventListener("input", validateRegisterNameField);
    registerEmailInput.addEventListener("input", validateRegisterEmailField);
  }

  /* ========================================================================
     8. REGISTER FORM — PASSWORD REQUIREMENTS (LIVE)
     ======================================================================== */

  /**
   * Expects (optional) markup like:
   * <ul class="password-requirements">
   *   <li data-requirement="minLength">At least 8 characters</li>
   *   <li data-requirement="uppercase">At least 1 uppercase letter</li>
   *   <li data-requirement="lowercase">At least 1 lowercase letter</li>
   *   <li data-requirement="number">At least 1 number</li>
   *   <li data-requirement="special">At least 1 special character</li>
   * </ul>
   * If this list isn't present in the HTML, the script still tracks and
   * validates requirements internally — it just skips the visual update.
   */
  function updatePasswordRequirementsUI(results) {
    if (!passwordRequirementsList) return;

    Object.keys(results).forEach((ruleKey) => {
      const item = passwordRequirementsList.querySelector(`[data-requirement="${ruleKey}"]`);
      if (!item) return;
      item.classList.toggle("met", results[ruleKey]);
    });
  }

  function validateRegisterPasswordField() {
    const value = registerPasswordInput.value;
    const results = evaluatePasswordRules(value);
    const allMet = Object.values(results).every(Boolean);

    updatePasswordRequirementsUI(results);

    if (!isNotEmpty(value)) {
      clearFieldState(registerPasswordInput);
      registerPasswordInput.classList.remove("requirements-met");
    } else if (allMet) {
      setFieldState(registerPasswordInput, "valid");
      registerPasswordInput.classList.add("requirements-met");
    } else {
      setFieldState(registerPasswordInput, "invalid");
      registerPasswordInput.classList.remove("requirements-met");
    }

    // Re-validate confirm password in case the reference password changed.
    validateRegisterConfirmPasswordField();
    updateSequentialGating();
  }

  function initPasswordRequirements() {
    registerPasswordInput.addEventListener("input", validateRegisterPasswordField);
  }

  /* ========================================================================
     9. REGISTER FORM — CONFIRM PASSWORD
     ======================================================================== */

  function validateRegisterConfirmPasswordField() {
    const confirmValue = registerConfirmPasswordInput.value;
    const passwordValue = registerPasswordInput.value;

    if (!isNotEmpty(confirmValue)) {
      clearFieldState(registerConfirmPasswordInput);
    } else if (confirmValue === passwordValue) {
      setFieldState(registerConfirmPasswordInput, "valid");
    } else {
      setFieldState(registerConfirmPasswordInput, "invalid");
    }

    updateRegisterSubmitAvailability();
  }

  function initConfirmPassword() {
    registerConfirmPasswordInput.addEventListener("input", () => {
      validateRegisterConfirmPasswordField();
    });
  }

  /* ========================================================================
     10. REGISTER FORM — SUBMIT HANDLING
     ======================================================================== */

  function initRegisterSubmit() {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Re-run every validator so nothing is skipped even if a field
      // was somehow left in a stale state.
      validateRegisterNameField();
      validateRegisterEmailField();
      validateRegisterPasswordField();
      validateRegisterConfirmPasswordField();

      if (!isRegisterFormValid()) {
        return;
      }

      setButtonLoading(registerBtn, "Creating account...");

      try {
        // NOTE: registrationData intentionally excludes the password fields.
        // Passwords are never stored, logged, or persisted client-side.
        const registrationData = {
          fullName: registerNameInput.value.trim(),
          email: registerEmailInput.value.trim(),
        };

        await simulateAccountCreation(registrationData, registerPasswordInput.value);

        handleRegisterSuccess(registrationData);
      } catch (error) {
        handleRegisterFailure(error);
      } finally {
        resetButtonLoading(registerBtn);
      }
    });
  }

  function handleRegisterSuccess(registrationData) {
    // Prototype-only feedback. Replace with real post-registration flow
    // (e.g. redirect, session creation) once a backend is connected.
    window.alert(
      `Prototype: account created for ${registrationData.email}. No real account exists yet — connect a backend to make this functional.`
    );
    showLogin();
  }

  function handleRegisterFailure(error) {
    window.alert("Prototype: registration could not be completed. Please try again.");
    // eslint-disable-next-line no-console
    console.error("Registration prototype error:", error.message);
  }

  /* ========================================================================
     11. PASSWORD VISIBILITY TOGGLES
     ======================================================================== */

  /**
   * Expects (optional) markup like:
   * <button type="button" class="password-toggle" data-target="login-password"
   *         aria-label="Show password" aria-pressed="false"></button>
   * placed near the relevant password input. If no such buttons exist yet,
   * this simply does nothing until they're added.
   */
  function initPasswordVisibilityToggles() {
    const toggleButtons = document.querySelectorAll(".password-toggle[data-target]");

    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        const targetInput = document.getElementById(targetId);
        if (!targetInput) return;

        const isCurrentlyHidden = targetInput.type === "password";
        targetInput.type = isCurrentlyHidden ? "text" : "password";

        button.setAttribute("aria-pressed", String(isCurrentlyHidden));
        button.setAttribute("aria-label", isCurrentlyHidden ? "Hide password" : "Show password");

        // Value is preserved automatically by the browser when switching
        // the input's `type` attribute — no manual re-assignment needed.
      });
    });
  }

  /* ========================================================================
     12. GOOGLE SIGN-IN (PROTOTYPE ONLY)
     ======================================================================== */

  function initGoogleSignIn() {
    if (!googleSignInBtn) return;

    googleSignInBtn.addEventListener("click", async () => {
      setButtonLoading(googleSignInBtn, "Connecting...");

      try {
        // PROTOTYPE ONLY — no real Google OAuth flow is triggered here.
        // Replace `simulateGoogleSignIn` with an actual OAuth redirect/popup
        // and token exchange against your backend when ready.
        await simulateGoogleSignIn();
        window.alert(
          "Prototype: this button will start Google Sign-In once real OAuth is connected. No sign-in has occurred."
        );
      } finally {
        resetButtonLoading(googleSignInBtn);
      }
    });
  }

  /* ========================================================================
     13. FORGOT PASSWORD (PROTOTYPE ONLY)
     ======================================================================== */

  function initForgotPassword() {
    if (!forgotPasswordLink) return;

    forgotPasswordLink.addEventListener("click", (event) => {
      event.preventDefault();

      const candidateEmail = loginEmailInput.value.trim();

      if (!isEmailValid(candidateEmail)) {
        setFieldState(loginEmailInput, "invalid");
        loginEmailInput.focus();
        return;
      }

      // PROTOTYPE ONLY — no email is actually sent.
      window.alert(
        `Prototype: a password reset flow would start for ${candidateEmail}. No email has been sent.`
      );
    });
  }

  /* ========================================================================
     14. AUTH REQUEST LAYER (STUB FOR FUTURE BACKEND INTEGRATION)
     ======================================================================== */

  /**
   * These functions simulate network calls so the UI states (loading,
   * success, failure) can be exercised end-to-end. Swap the internals for
   * real `fetch` calls to your API when the backend is ready — the calling
   * code above does not need to change.
   */

  function simulateAuthDelay() {
    return new Promise((resolve) => setTimeout(resolve, SIMULATED_AUTH_DELAY));
  }

  async function simulateLogin(credentials) {
    // `credentials.password` is used only in-memory for this simulated call
    // and is never logged, stored, or persisted.
    await simulateAuthDelay();
    return { email: credentials.email };
  }

  async function simulateAccountCreation(registrationData, password) {
    // `password` is used only in-memory for this simulated call and is
    // never logged, stored, or persisted.
    void password;
    await simulateAuthDelay();
    return { ...registrationData };
  }

  async function simulateGoogleSignIn() {
    await simulateAuthDelay();
    return null;
  }

  /* ========================================================================
     10b. LOGIN FORM — SUBMIT HANDLING
     (kept near the auth request layer it depends on)
     ======================================================================== */

  function initLoginSubmit() {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const emailValid = validateLoginEmailField();
      const passwordValid = validateLoginPasswordField();

      if (!emailValid || !passwordValid) {
        if (!isEmailValid(loginEmailInput.value)) {
          setFieldState(loginEmailInput, "invalid");
        }
        if (!isNotEmpty(loginPasswordInput.value)) {
          setFieldState(loginPasswordInput, "invalid");
        }
        return;
      }

      setButtonLoading(loginBtn, "Logging in...");

      try {
        const credentials = {
          email: loginEmailInput.value.trim(),
          password: loginPasswordInput.value,
        };

        await simulateLogin(credentials);

        handleLoginSuccess(credentials.email);
      } catch (error) {
        handleLoginFailure(error);
      } finally {
        resetButtonLoading(loginBtn);
      }
    });
  }

  function handleLoginSuccess(email) {
    // Prototype-only feedback. Replace with real session handling / redirect
    // once a backend is connected.
    window.alert(`Prototype: login simulated for ${email}. No real session has been created.`);
  }

  function handleLoginFailure(error) {
    window.alert("Prototype: login could not be completed. Please try again.");
    // eslint-disable-next-line no-console
    console.error("Login prototype error:", error.message);
  }

  /* ========================================================================
     15. INIT
     ======================================================================== */

  function init() {
    initToggle();

    initLoginFormValidation();
    initLoginSubmit();

    initSequentialGating();
    initPasswordRequirements();
    initConfirmPassword();
    initRegisterSubmit();

    initPasswordVisibilityToggles();
    initGoogleSignIn();
    initForgotPassword();
  }

  document.addEventListener("DOMContentLoaded", init);
})();