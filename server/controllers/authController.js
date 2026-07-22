const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ---------------------------------------------------------------
// Format user response
// ---------------------------------------------------------------
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  skillsToTeach: user.skillsToTeach,
  skillsToLearn: user.skillsToLearn,
  location: user.location,
  availability: user.availability,
  profilePicture: user.profilePicture,
  createdAt: user.createdAt,
});

// ---------------------------------------------------------------
// Register
// ---------------------------------------------------------------
const registerUser = async (req, res, next) => {
  try {
    console.log(req.body);

    const {
      name,
      email,
      password,
      bio = "",
      location = "",
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      bio,
      location,
    });
console.log("USER SAVED:", user);
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// Login
// ---------------------------------------------------------------
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// Get Profile
// ---------------------------------------------------------------
const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      user: formatUserResponse(req.user),
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// Update Profile
// ---------------------------------------------------------------
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;

    console.log("REQ BODY:", req.body);

    const updatableFields = [
      "name",
      "bio",
      "skillsToTeach",
      "skillsToLearn",
      "location",
      "availability",
      "profilePicture",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    console.log("BEFORE SAVE:", user);

    const updatedUser = await user.save();

    console.log("AFTER SAVE:", updatedUser);

    res.status(200).json({
      message: "Profile updated successfully",
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};