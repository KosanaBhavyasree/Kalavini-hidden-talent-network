const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ---------------------------------------------------------------
// USER MODEL
// ---------------------------------------------------------------
// Kalavini is an open skill-sharing platform.
// Users can teach skills, learn skills, exchange knowledge,
// and connect with other learners and mentors.
// ---------------------------------------------------------------

const userSchema = new mongoose.Schema(
  {
    // -----------------------------------------------------------
    // Basic Information
    // -----------------------------------------------------------
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },

    // -----------------------------------------------------------
    // Skills
    // -----------------------------------------------------------
    skillsToTeach: {
      type: [String],
      default: [],
    },

    skillsToLearn: {
      type: [String],
      default: [],
    },

    // -----------------------------------------------------------
    // Profile Information
    // -----------------------------------------------------------
    location: {
      type: String,
      default: "",
    },

    availability: {
      type: String,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    // -----------------------------------------------------------
    // Account Status
    // -----------------------------------------------------------
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

userSchema.index({ skillsToTeach: 1 });
userSchema.index({ skillsToLearn: 1 });

// ---------------------------------------------------------------
// HASH PASSWORD BEFORE SAVING
// Compatible with Mongoose 9
// ---------------------------------------------------------------

userSchema.pre("save", async function () {
  // Only hash if password has changed
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ---------------------------------------------------------------
// PASSWORD COMPARISON
// ---------------------------------------------------------------

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);