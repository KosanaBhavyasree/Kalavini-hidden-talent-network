const Request = require("../models/Request");
const Skill = require("../models/Skill");
const createNotification = require("../utils/createNotification");

// ---------------------------------------------------------------
// @desc    Send a skill exchange request
// @route   POST /api/requests
// @access  Private
// ---------------------------------------------------------------
// Flow:
//   1. Look up the skill being requested, to find who teaches it
//      (the receiver) - the frontend only sends skillId, not the
//      teacher's id, since the backend is the source of truth for
//      who actually owns that skill.
//   2. Block self-requests (can't request your own skill).
//   3. Block duplicate pending requests for the same skill from
//      the same sender, so spamming the request button doesn't
//      create five identical pending requests.
//   4. Create the request and notify the receiver.
// ---------------------------------------------------------------
const sendRequest = async (req, res, next) => {
  try {
    const { skillId, offeredSkill, message } = req.body;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const receiverId = skill.teacher;

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot request your own skill" });
    }

    const existingPending = await Request.findOne({
      sender: req.user._id,
      skill: skillId,
      status: "pending",
    });

    if (existingPending) {
      return res.status(409).json({
        message: "You already have a pending request for this skill",
      });
    }

    const request = await Request.create({
      sender: req.user._id,
      receiver: receiverId,
      skill: skillId,
      offeredSkill,
      message,
    });

    await createNotification({
      recipient: receiverId,
      type: "request_received",
      message: `${req.user.name} wants to learn "${skill.title}" from you`,
      relatedRequest: request._id,
    });

    res.status(201).json({
      message: "Request sent successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Get requests for the logged-in user (sent and/or received)
// @route   GET /api/requests
// @access  Private
// ---------------------------------------------------------------
// Query params:
//   direction - "sent" | "received" | "all" (default "all")
//   status    - "pending" | "accepted" | "rejected" | "cancelled"
//               (omit to get all statuses - used by the Requests
//               page tabs)
//
// Example: GET /api/requests?direction=received&status=pending
// ---------------------------------------------------------------
const getRequests = async (req, res, next) => {
  try {
    const { direction = "all", status } = req.query;

    const userId = req.user._id;
    let query;

    if (direction === "sent") {
      query = { sender: userId };
    } else if (direction === "received") {
      query = { receiver: userId };
    } else {
      query = { $or: [{ sender: userId }, { receiver: userId }] };
    }

    if (status) {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate("sender", "name profilePicture")
      .populate("receiver", "name profilePicture")
      .populate("skill", "title category")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Update a request's status (accept, reject, or cancel)
// @route   PUT /api/requests/:id
// @access  Private
// ---------------------------------------------------------------
// Authorization rules, enforced here rather than trusted from the
// frontend:
//   - Only the RECEIVER can accept or reject.
//   - Only the SENDER can cancel.
//   - A request can only transition out of "pending" - you can't
//     accept something that was already rejected, for example.
// ---------------------------------------------------------------
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id).populate("skill", "title");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: `This request has already been ${request.status} and cannot be changed`,
      });
    }

    const userId = req.user._id.toString();
    const isReceiver = request.receiver.toString() === userId;
    const isSender = request.sender.toString() === userId;

    if ((status === "accepted" || status === "rejected") && !isReceiver) {
      return res.status(403).json({
        message: "Only the recipient of this request can accept or reject it",
      });
    }

    if (status === "cancelled" && !isSender) {
      return res.status(403).json({
        message: "Only the sender of this request can cancel it",
      });
    }

    request.status = status;
    await request.save();

    // Notify the OTHER party about the status change. We look up
    // who sent the request to address the notification correctly
    // by name.
    const notifyMap = {
      accepted: {
        recipient: request.sender,
        type: "request_accepted",
        message: `Your request for "${request.skill.title}" was accepted`,
      },
      rejected: {
        recipient: request.sender,
        type: "request_rejected",
        message: `Your request for "${request.skill.title}" was declined`,
      },
      cancelled: {
        recipient: request.receiver,
        type: "request_cancelled",
        message: `A request for "${request.skill.title}" was cancelled by the sender`,
      },
    };

    const notification = notifyMap[status];
    if (notification) {
      await createNotification({ ...notification, relatedRequest: request._id });
    }

    res.status(200).json({
      message: `Request ${status} successfully`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendRequest,
  getRequests,
  updateRequestStatus,
};
