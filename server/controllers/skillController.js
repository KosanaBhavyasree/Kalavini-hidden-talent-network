const Skill = require("../models/Skill");

// ---------------------------------------------------------------
// @desc    Create a new skill listing
// @route   POST /api/skills
// @access  Private
// ---------------------------------------------------------------
const createSkill = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, availability, desiredSkillExchange } =
      req.body;

    const skill = await Skill.create({
      teacher: req.user._id,
      title,
      description,
      category,
      difficulty,
      availability,
      desiredSkillExchange,
    });

    res.status(201).json({
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Browse skills with search, category filter, pagination, sort
// @route   GET /api/skills
// @access  Public
// ---------------------------------------------------------------
// Query params (all optional):
//   search    - text search across title/description
//   category  - exact category match
//   difficulty- exact difficulty match
//   sort      - "newest" (default), "rating", "title"
//   page      - default 1
//   limit     - default 12 (a nice grid number: 3x4 or 4x3 cards)
//
// Example: GET /api/skills?search=guitar&category=Music&page=2
// ---------------------------------------------------------------
const getSkills = async (req, res, next) => {
  try {
    const { search, category, difficulty, sort = "newest", page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      rating: { averageRating: -1 },
      title: { title: 1 },
    };
    const sortOption = sortMap[sort] || sortMap.newest;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    // Run the count and the actual page fetch in parallel rather
    // than sequentially - they're independent queries, so there's
    // no reason to wait for one before starting the other.
    const [skills, totalCount] = await Promise.all([
      Skill.find(query)
        .populate("teacher", "name profilePicture department")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Skill.countDocuments(query),
    ]);

    res.status(200).json({
      skills,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Get a single skill's full details (for Skill Details page)
// @route   GET /api/skills/:id
// @access  Public
// ---------------------------------------------------------------
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate("teacher", "name profilePicture department bio location availability")
      .populate("reviews.reviewer", "name profilePicture");

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({ skill });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Update a skill listing (only the teacher who owns it)
// @route   PUT /api/skills/:id
// @access  Private
// ---------------------------------------------------------------
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // Ownership check: only the teacher who created this skill can
    // edit it. Compare as strings since teacher is an ObjectId and
    // req.user._id is also an ObjectId - direct === would fail even
    // for the same id because they're different object instances.
    if (skill.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this skill" });
    }

    const updatableFields = [
      "title",
      "description",
      "category",
      "difficulty",
      "availability",
      "desiredSkillExchange",
      "isActive",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        skill[field] = req.body[field];
      }
    });

    const updatedSkill = await skill.save();

    res.status(200).json({
      message: "Skill updated successfully",
      skill: updatedSkill,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Delete a skill listing (only the teacher who owns it)
// @route   DELETE /api/skills/:id
// @access  Private
// ---------------------------------------------------------------
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this skill" });
    }

    await skill.deleteOne();

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Get all skills taught by the logged-in user
// @route   GET /api/skills/mine
// @access  Private
// ---------------------------------------------------------------
// Used by the Dashboard and Profile pages to show "Skills I Teach"
// as full listings (not just the plain string array on User).
const getMySkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ teacher: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ skills });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------
// @desc    Add a review to a skill
// @route   POST /api/skills/:id/reviews
// @access  Private
// ---------------------------------------------------------------
// A user can only review a skill they don't teach themselves
// (reviewing your own skill would be meaningless), and only once
// (checked below by looking for an existing review from this
// reviewer). After adding the review, we recalculate and store
// averageRating so Browse page sorting/filtering by rating stays
// fast.
// ---------------------------------------------------------------
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.teacher.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot review your own skill" });
    }

    const alreadyReviewed = skill.reviews.some(
      (review) => review.reviewer.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(409).json({ message: "You have already reviewed this skill" });
    }

    skill.reviews.push({
      reviewer: req.user._id,
      rating,
      comment,
    });

    // Recalculate the average from scratch. With a realistic number
    // of reviews per skill (tens, not millions), this is cheap
    // enough to do on every new review rather than maintaining a
    // running sum/count separately.
    const total = skill.reviews.reduce((sum, r) => sum + r.rating, 0);
    skill.averageRating = total / skill.reviews.length;

    await skill.save();

    res.status(201).json({
      message: "Review added successfully",
      skill,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  getMySkills,
  addReview,
};
