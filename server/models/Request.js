const mongoose = require("mongoose");

// ---------------------------------------------------------------
// REQUEST MODEL
// ---------------------------------------------------------------
// A Request represents one user asking another to do a skill
// exchange - e.g. "I want to learn your Guitar skill, and I'll
// teach you Python in return." This is the core transaction object
// of the whole platform.
//
// Status lifecycle:
//   pending   -> just created, waiting on the receiver
//   accepted  -> receiver said yes
//   rejected  -> receiver said no
//   cancelled -> the SENDER withdrew it before the receiver acted
//
// We never delete requests - keeping rejected/cancelled ones gives
// us "Recent Activity" and exchange history for the Profile page
// later, and lets the matching algorithm avoid re-suggesting a
// pairing that was already rejected.
// ---------------------------------------------------------------

const requestSchema = new mongoose.Schema(
  {
    // Who is sending the request (wants to learn something).
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Who is receiving the request (offers the skill being requested).
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The specific Skill listing being requested.
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    // What the sender is offering in return. Optional free text,
    // since not every exchange needs a named counter-skill up
    // front - the two people might negotiate this in person.
    offeredSkill: {
      type: String,
      default: "",
    },

    // A short message from the sender explaining why they're
    // interested / what they're offering, shown on the receiver's
    // Requests page.
    message: {
      type: String,
      default: "",
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// ---------------------------------------------------------------
// INDEXES
// ---------------------------------------------------------------
// These speed up the two most common queries: "requests I sent"
// and "requests I received", both usually filtered by status on
// the Requests page tabs (Pending/Accepted/Rejected/Cancelled).
requestSchema.index({ sender: 1, status: 1 });
requestSchema.index({ receiver: 1, status: 1 });

module.exports = mongoose.model("Request", requestSchema);
