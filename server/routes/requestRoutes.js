const express = require("express");
const router = express.Router();
const {
  sendRequest,
  getRequests,
  updateRequestStatus,
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");
const {
  sendRequestValidationRules,
  updateRequestStatusValidationRules,
} = require("../middleware/validators/requestValidator");

router.use(protect);

router.post("/", sendRequestValidationRules, sendRequest);
router.get("/", getRequests);
router.put("/:id", updateRequestStatusValidationRules, updateRequestStatus);

module.exports = router;