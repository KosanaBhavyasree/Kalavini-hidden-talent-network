const { body, validationResult } = require("express-validator");

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

// Attached to POST /api/requests
const sendRequestValidationRules = [
  body("skillId")
    .notEmpty()
    .withMessage("skillId is required")
    .isMongoId()
    .withMessage("skillId must be a valid id"),

  body("offeredSkill")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("offeredSkill cannot exceed 100 characters"),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters"),

  handleValidationErrors,
];

// Attached to PUT /api/requests/:id - only the status changes here.
const updateRequestStatusValidationRules = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["accepted", "rejected", "cancelled"])
    .withMessage("Status must be accepted, rejected, or cancelled"),

  handleValidationErrors,
];

module.exports = {
  sendRequestValidationRules,
  updateRequestStatusValidationRules,
};
