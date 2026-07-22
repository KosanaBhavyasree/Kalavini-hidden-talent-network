const Notification = require("../models/Notification");

// ---------------------------------------------------------------
// createNotification
// ---------------------------------------------------------------
// Small reusable helper so requestController (and later,
// reviewController if we add one) doesn't duplicate
// "new Notification({...}).save()" in five different places.
//
// We deliberately do NOT throw if this fails - a notification
// failing to save should never block the actual action (e.g. if
// notification creation fails, the request itself should still go
// through). We log the error and move on.
//
// Usage:
//   await createNotification({
//     recipient: receiverId,
//     type: "request_received",
//     message: "Alice wants to learn your Guitar skill",
//     relatedRequest: request._id,
//   });
// ---------------------------------------------------------------
const createNotification = async ({ recipient, type, message, relatedRequest = null }) => {
  try {
    await Notification.create({ recipient, type, message, relatedRequest });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

module.exports = createNotification;
