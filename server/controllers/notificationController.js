const Notification = require("../models/Notification");

// ---------------------------------------------------------------
// @desc    Get the logged-in user's notifications
// @route   GET /api/notifications
// @access  Private
// ---------------------------------------------------------------
// Returns newest first. The frontend groups these by date itself
// (Today / Yesterday / This week, etc.) - we just provide
// createdAt and let the presentation layer decide how to bucket
// it, since that's a display concern, not a data concern.
// ---------------------------------------------------------------
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("relatedRequest")
      .sort({ createdAt: -1 })
      .limit(100); // reasonable cap - this is a feed, not an archive

    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Get the count of unread notifications
// @route   GET /api/notifications/unread-count
// @access  Private
// ---------------------------------------------------------------
// Dedicated lightweight endpoint for the navbar's unread badge -
// avoids fetching all 100 notifications just to count a handful of
// unread ones every time the badge needs to refresh.
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
// ---------------------------------------------------------------
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this notification" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Mark all of the logged-in user's notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
// ---------------------------------------------------------------
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
