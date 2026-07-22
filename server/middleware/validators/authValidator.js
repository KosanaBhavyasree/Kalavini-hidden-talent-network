const { body, validationResult } = require("express-validator");

// ---------------------------------------------------------------
// Handle Validation Errors
// ---------------------------------------------------------------
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

// ---------------------------------------------------------------
// Register Validation
// ---------------------------------------------------------------
const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),

  handleValidationErrors,
];

// ---------------------------------------------------------------
// Login Validation
// ---------------------------------------------------------------
const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  handleValidationErrors,
];

// ---------------------------------------------------------------
// Update Profile Validation
// ---------------------------------------------------------------
const updateProfileValidationRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),

  body("availability")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Availability cannot exceed 100 characters"),

  body("skillsToTeach")
    .optional()
    .isArray()
    .withMessage("skillsToTeach must be an array"),

  body("skillsToLearn")
    .optional()
    .isArray()
    .withMessage("skillsToLearn must be an array"),

  handleValidationErrors,
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
  updateProfileValidationRules,
};