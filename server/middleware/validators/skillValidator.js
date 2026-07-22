const { body, validationResult } = require("express-validator");

// Reuses the same pattern as authValidator.js - collects
// express-validator errors and responds with 400 + a clean list
// instead of letting the request reach the controller.
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

// Attached to POST /api/skills
const createSkillValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 80 })
    .withMessage("Title cannot exceed 80 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("difficulty")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Difficulty must be Beginner, Intermediate, or Advanced"),

  handleValidationErrors,
];

// Attached to PUT /api/skills/:id - all fields optional since it's
// an update, but must be valid if provided.
const updateSkillValidationRules = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage("Title must be between 1 and 80 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Description must be between 1 and 1000 characters"),

  body("difficulty")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Difficulty must be Beginner, Intermediate, or Advanced"),

  handleValidationErrors,
];

// Attached to POST /api/skills/:id/reviews
const reviewValidationRules = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a whole number between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters"),

  handleValidationErrors,
];

module.exports = {
  createSkillValidationRules,
  updateSkillValidationRules,
  reviewValidationRules,
};
