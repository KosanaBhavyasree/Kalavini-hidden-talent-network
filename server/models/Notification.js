const mongoose = require("mongoose");

// ---------------------------------------------------------------
// NOTIFICATION MODEL
// ---------------------------------------------------------------
// Stores in-app notifications for a user. We are NOT building
// real-time push (websockets) in this module - notifications are
// created server-side whenever a relevant event happens (e.g. a
// new request comes in) and the frontend polls/fetches them via
// GET /api/notifications. The "real-time style UI" from the brief
// refers to the frontend presentation (icons, unread badges,
// grouping by date) - the data layer here is a normal REST
// resource, which keeps this module deployable without needing a
// websocket server.
// ---------------------------------------------------------------

const notificationSchema = new mongoose.Schema(
  {
    // Who this notification is FOR.
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The type drives which icon the frontend shows and lets us
    // add new notification types later without a schema change.
    type: {
      type: String,
      enum: [
        "request_received",
        "request_accepted",
        "request_rejected",
        "request_cancelled",
        "new_review",
      ],
      required: true,
    },

    // Human-readable text shown in the notification list. Built
    // server-side at creation time (e.g. "Alice wants to learn
    // your Guitar skill") so the frontend doesn't need to
    // reconstruct sentences from raw data.
    message: {
      type: String,
      required: true,
    },

    // Optional link to the Request that triggered this
    // notification, so clicking it can navigate straight to the
    // relevant request.
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Speeds up "get my unread notifications" and "get my notifications
// sorted by newest", which is how the Notifications page and the
// navbar's unread badge both query this collection.
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
