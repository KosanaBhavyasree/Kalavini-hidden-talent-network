// src/services/api.js
//
// This is the SINGLE axios instance used by the entire app.
// Every other service file (authService.js, skillService.js, etc.)
// will import `api` from here instead of creating its own axios
// instance. That gives us one place to configure:
//   1. The backend base URL (from .env)
//   2. Automatically attaching the JWT token to every request
//   3. Automatically logging the user out if the token expires (401)

import axios from "axios";

// Vite exposes env vars prefixed with VITE_ on import.meta.env
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR ---
// Runs before every request leaves the browser.
// If we have a JWT saved in localStorage, attach it as a Bearer token.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kalavini_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- RESPONSE INTERCEPTOR ---
// Runs after every response comes back.
// If the backend says the token is invalid/expired (401), we clear
// the stored session so the user gets redirected to login instead
// of being stuck in a broken logged-in state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("kalavini_token");
      localStorage.removeItem("kalavini_user");
    }
    return Promise.reject(error);
  }
);

export default api;
