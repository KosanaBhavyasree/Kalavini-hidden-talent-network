const mongoose = require("mongoose");

// ---------------------------------------------------------------
// SKILL MODEL
// ---------------------------------------------------------------
// A Skill is a single "listing" a user creates to offer something
// they teach - e.g. "Acoustic Guitar for Beginners" by user Alice.
//
// This is intentionally a SEPARATE model from User.skillsToTeach
// (the plain string array added in Module 2). That array is a
// lightweight signal used by the matching algorithm to quickly
// scan "who teaches X". This Skill model is the full, rich listing
// shown on the Browse and Skill Details pages - it has a
// description, difficulty, category, and aggregated review data
// that a plain string can't hold.
// ---------------------------------------------------------------

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const skillSchema = new mongoose.Schema(
  {
    // The user who is teaching this skill.
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Skill title is required"],
      trim: true,
      maxlength: [80, "Title cannot exceed 80 characters"],
    },

    description: {
      type: String,
      required: [true, "Skill description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    // Used for Browse page filters/categories. Kept as a free
    // string rather than an enum so new categories don't require a
    // schema migration - the frontend can still offer a fixed
    // dropdown of common categories while allowing custom ones.
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // Free-text availability shown on Skill Details (e.g.
    // "Weekday evenings, IST"). Mirrors User.availability but is
    // specific to THIS skill listing, since a teacher might offer
    // different time slots for different skills.
    availability: {
      type: String,
      default: "",
    },

    // What the teacher wants in exchange. Optional - some teachers
    // are happy to teach without naming a specific skill they want
    // back, and the matching algorithm can still suggest exchanges
    // based on User.skillsToLearn.
    desiredSkillExchange: {
      type: String,
      default: "",
    },

    reviews: [reviewSchema],

    // Denormalized average rating, recalculated whenever a review
    // is added (see addReview in skillController.js). Storing this
    // on the document avoids recalculating an average from all
    // reviews every time the Browse page needs to sort by rating.
    averageRating: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ---------------------------------------------------------------
// INDEXES
// ---------------------------------------------------------------
// Text index powers the search bar on the Browse page (search by
// title/description). Category index speeds up filter queries.
skillSchema.index({ title: "text", description: "text" });
skillSchema.index({ category: 1 });
skillSchema.index({ teacher: 1 });

module.exports = mongoose.model("Skill", skillSchema);
