const express = require("express");
const router = express.Router();
const {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  getMySkills,
  addReview,
} = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware");
const {
  createSkillValidationRules,
  updateSkillValidationRules,
  reviewValidationRules,
} = require("../middleware/validators/skillValidator");

// NOTE on ordering: "/mine" must be defined BEFORE "/:id", otherwise
// Express would treat "mine" as a value for the :id parameter and
// try to look up a skill with the literal id "mine", which would
// always 404 or throw a cast error.
router.get("/my", protect, getMySkills);

router.get("/", getSkills);
router.post("/", protect, createSkillValidationRules, createSkill);

router.get("/:id", getSkillById);
router.put("/:id", protect, updateSkillValidationRules, updateSkill);
router.delete("/:id", protect, deleteSkill);

router.post("/:id/reviews", protect, reviewValidationRules, addReview);

module.exports = router;
