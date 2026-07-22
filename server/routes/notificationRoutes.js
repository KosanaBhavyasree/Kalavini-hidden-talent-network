const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// NOTE on ordering: "/unread-count" and "/read-all" must come
// before "/:id/read" route conflicts aren't actually possible here
// since the paths have different shapes, but keeping specific
// routes grouped together above parameterized ones is good
// practice for readability and avoiding future mistakes.
router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);

module.exports = router;
