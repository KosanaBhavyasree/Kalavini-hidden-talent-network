const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const {
  registerValidationRules,
  loginValidationRules,
  updateProfileValidationRules,
} = require("../middleware/validators/authValidator");

// 👇 THIS LINE
router.post("/register", registerValidationRules, registerUser);

router.post("/login", loginValidationRules, loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileValidationRules, updateProfile);

module.exports = router;