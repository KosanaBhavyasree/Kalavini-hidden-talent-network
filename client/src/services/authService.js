// src/services/authService.js

import api from "./api";

// ---------------------------------------------------------------
// Register User
// ---------------------------------------------------------------
export const registerUser = async ({
  name,
  email,
  password,
  bio,
  location,
}) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    bio,
    location,
  });

  return response.data;
};

// ---------------------------------------------------------------
// Login User
// ---------------------------------------------------------------
export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// ---------------------------------------------------------------
// Fetch Logged-in User Profile
// ---------------------------------------------------------------
export const fetchProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// ---------------------------------------------------------------
// Update Profile
// ---------------------------------------------------------------
export const updateProfile = async (updates) => {
  const response = await api.put("/auth/profile", updates);
  return response.data;
};