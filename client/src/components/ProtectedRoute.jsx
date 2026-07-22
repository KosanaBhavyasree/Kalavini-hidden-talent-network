// src/components/ProtectedRoute.jsx
//
// Wraps any route that should only be visible to logged-in users.
// Usage (in App.jsx, added in later modules):
//
//   <Route path="/dashboard" element={
//     <ProtectedRoute><Dashboard /></ProtectedRoute>
//   } />
//
// Behavior:
//   - While the initial auth check is running (AuthContext's
//     `loading` is true), we render nothing rather than redirecting
//     immediately - otherwise a logged-in user with a valid saved
//     token would get bounced to /login for a split second on every
//     page refresh, before we've had a chance to verify their token.
//   - Once loading is false: if there's no user, redirect to
//     /login. We pass the original location in state so the Login
//     page can send the user back to where they were trying to go
//     after they log in successfully.
//   - If there IS a user, render the protected page.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
