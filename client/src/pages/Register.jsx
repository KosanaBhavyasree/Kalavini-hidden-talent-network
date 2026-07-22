// src/pages/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    bio: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        bio: formData.bio,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

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
          <h2>Teach what you know. Learn what you love.</h2>

          <p>
            Join a community where skills are the currency. Exchange knowledge,
            discover hidden talents, and grow together.
          </p>
        </div>

        <div className={styles.brandFooterNote}>
          Art &middot; Knowledge &middot; Culture &middot; Community
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <h1>Create your account</h1>

          <p className={styles.formSubtitle}>
            Already have an account?{" "}
            <Link to="/login">Log in</Link> instead.
          </p>

          {serverError && (
            <div className={styles.serverError}>{serverError}</div>
          )}

          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Name */}

            <div className={styles.field}>
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Keerthi"
                value={formData.name}
                onChange={handleChange}
                className={fieldErrors.name ? styles.inputError : ""}
              />

              {fieldErrors.name && (
                <span className={styles.fieldErrorText}>
                  {fieldErrors.name}
                </span>
              )}
            </div>

            {/* Email */}

            <div className={styles.field}>
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={fieldErrors.email ? styles.inputError : ""}
              />

              {fieldErrors.email && (
                <span className={styles.fieldErrorText}>
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password */}

            <div className={styles.field}>
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                className={fieldErrors.password ? styles.inputError : ""}
              />

              {fieldErrors.password && (
                <span className={styles.fieldErrorText}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Location */}

            <div className={styles.field}>
              <label htmlFor="location">
                Location <small>(Optional)</small>
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Visakhapatnam"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Bio */}

            <div className={styles.field}>
              <label htmlFor="bio">
                Bio <small>(Optional)</small>
              </label>

              <textarea
                id="bio"
                name="bio"
                rows="3"
                placeholder="Tell everyone a little about yourself..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}

            <div className={styles.field}>
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={
                  fieldErrors.confirmPassword ? styles.inputError : ""
                }
              />

              {fieldErrors.confirmPassword && (
                <span className={styles.fieldErrorText}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={submitting}
            >
              {submitting
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className={styles.switchText}>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;