// src/context/AuthContext.jsx
//
// This is the single source of truth for "who is currently logged
// in." Any component that needs the current user, or needs to
// log in/out/register, imports the useAuth() hook exported below
// instead of talking to authService or localStorage directly.
//
// Why a Context instead of just localStorage everywhere?
// Because React doesn't automatically re-render components when
// localStorage changes. By keeping the user in React state (and
// only using localStorage to persist it across page refreshes),
// every component using useAuth() re-renders immediately when the
// user logs in, logs out, or updates their profile.

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  loginUser as loginUserApi,
  registerUser as registerUserApi,
  fetchProfile,
} from "../services/authService";

const AuthContext = createContext(null);

// Keys used in localStorage. Kept as constants so the request
// interceptor in services/api.js and this file never get out of
// sync about what the keys are called.
const TOKEN_KEY = "kalavini_token";
const USER_KEY = "kalavini_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // `loading` is true only during the initial check on app load,
  // while we verify whether a saved token is still valid. Pages
  // like ProtectedRoute use this to avoid redirecting to /login
  // for a split second before we've even checked localStorage.
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------
  // On first mount: check if we have a saved token. If so, try to
  // fetch the fresh profile from the backend (this also doubles as
  // a way to verify the token is still valid - if it's expired,
  // the axios response interceptor in api.js will clear storage
  // and the fetchProfile call below will fail, which we handle by
  // logging out cleanly).
  // ---------------------------------------------------------------
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchProfile();
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch (error) {
        // Token was invalid/expired - clear everything and treat
        // the user as logged out.
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ---------------------------------------------------------------
  // register: calls the backend, then immediately logs the user in
  // (the backend already returns a token on successful registration,
  // so there's no need for a separate login step).
  // ---------------------------------------------------------------
  const register = useCallback(async (formData) => {
    const data = await registerUserApi(formData);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  // ---------------------------------------------------------------
  // login: calls the backend, stores the token + user, updates state.
  // Throws on failure (caller's try/catch in Login.jsx handles
  // showing the error message to the user).
  // ---------------------------------------------------------------
  const login = useCallback(async (credentials) => {
    const data = await loginUserApi(credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  // ---------------------------------------------------------------
  // logout: clears everything. No API call needed since JWTs are
  // stateless - the backend doesn't track active sessions, so
  // "logging out" just means forgetting the token on our side.
  // ---------------------------------------------------------------
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // ---------------------------------------------------------------
  // updateUser: lets other parts of the app (e.g. EditProfile page,
  // built in a later module) update the cached user object after a
  // successful PUT /api/auth/profile, without re-fetching everything.
  // ---------------------------------------------------------------
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------
// useAuth
// ---------------------------------------------------------------
// Custom hook so components do `const { user, login } = useAuth();`
// instead of `useContext(AuthContext)` everywhere. Also throws a
// clear error if someone forgets to wrap the app in <AuthProvider>,
// which is much easier to debug than a silent `null` reference.
// ---------------------------------------------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
