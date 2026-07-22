const express = require("express");
const router = express.Router();
const { getRecommendedUsers } = require("../controllers/matchController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getRecommendedUsers);

module.exports = router;
