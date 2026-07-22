// src/pages/Login.jsx
//
// Login page. Split-panel layout: left side is brand/illustration,
// right side is the actual form. Validates inputs client-side
// before calling the API (so the user gets instant feedback
// without waiting on a network round-trip for obvious mistakes
// like an empty field), then calls useAuth().login() which talks
// to the backend and updates global auth state on success.

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If the user was redirected here by ProtectedRoute (e.g. they
  // tried to visit /dashboard while logged out), `from` holds where
  // they were headed, so we can send them back there after login.
  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear that field's error as soon as the user starts fixing it.
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Client-side validation mirrors (but doesn't replace) the
  // backend's express-validator rules. This catches obvious
  // mistakes instantly; the backend is still the source of truth.
  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (error) {
      // Backend sends { message: "..." } on 401/400/500.
      const message =
        error.response?.data?.message || "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.brandPanel}>
        <div className={styles.brandLogo}>Kalavini</div>
        <div className={styles.brandContent}>
          <h2>Welcome back, talent.</h2>
          <p>
            Pick up where you left off. Your skill exchanges, requests, and
            community are waiting for you.
          </p>
        </div>
        <div className={styles.brandFooterNote}>
          Art &middot; Knowledge &middot; Culture &middot; Community
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <h1>Log in</h1>
          <p className={styles.formSubtitle}>
            New to Kalavini?{" "}
            <Link to="/register">Create an account</Link> instead.
          </p>

          {serverError && <div className={styles.serverError}>{serverError}</div>}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={fieldErrors.email ? styles.inputError : ""}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <span className={styles.fieldErrorText}>{fieldErrors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={fieldErrors.password ? styles.inputError : ""}
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <span className={styles.fieldErrorText}>{fieldErrors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className={styles.switchText}>
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
