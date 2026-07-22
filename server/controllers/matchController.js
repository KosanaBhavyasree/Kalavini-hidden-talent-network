const User = require("../models/User");

// ---------------------------------------------------------------
// MATCHING ALGORITHM
// ---------------------------------------------------------------
// The core idea: a good match is someone who teaches what I want
// to learn, AND wants to learn what I teach. That's a genuine
// two-way exchange, not just a shared-interest match.
//
// Scoring (out of 100), explained so the percentage shown to the
// user actually means something instead of being an arbitrary
// number:
//   - up to 50 points: how many of MY "want to learn" skills they
//     teach (as a fraction of my total wanted skills)
//   - up to 30 points: how many of THEIR "want to learn" skills I
//     teach (as a fraction of their total wanted skills) - this is
//     weighted less than the above because from the current user's
//     point of view, "can I learn from them" matters slightly more
//     than "can they learn from me", but both matter for a real
//     exchange to happen
//   - up to 10 points: same location string (case-insensitive)
//   - up to 10 points: both have a non-empty availability string
//     that overlaps as a substring match (a simple heuristic - a
//     real scheduling system would need structured time slots,
//     which is beyond what the brief's free-text availability
//     field supports)
// ---------------------------------------------------------------

const normalize = (arr) => (arr || []).map((s) => s.trim().toLowerCase()).filter(Boolean);

const calculateMatchScore = (currentUser, candidate) => {
  const myWants = normalize(currentUser.skillsToLearn);
  const myTeaches = normalize(currentUser.skillsToTeach);
  const theirTeaches = normalize(candidate.skillsToTeach);
  const theirWants = normalize(candidate.skillsToLearn);

  let score = 0;
  const matchedSkillsTheyTeach = [];
  const matchedSkillsITeach = [];

  if (myWants.length > 0) {
    const overlap = theirTeaches.filter((skill) => myWants.includes(skill));
    matchedSkillsTheyTeach.push(...overlap);
    score += (overlap.length / myWants.length) * 50;
  }

  if (theirWants.length > 0) {
    const overlap = myTeaches.filter((skill) => theirWants.includes(skill));
    matchedSkillsITeach.push(...overlap);
    score += (overlap.length / theirWants.length) * 30;
  }

  if (
    currentUser.location &&
    candidate.location &&
    currentUser.location.trim().toLowerCase() === candidate.location.trim().toLowerCase()
  ) {
    score += 10;
  }

  if (
    currentUser.availability &&
    candidate.availability &&
    (currentUser.availability.toLowerCase().includes(candidate.availability.toLowerCase()) ||
      candidate.availability.toLowerCase().includes(currentUser.availability.toLowerCase()))
  ) {
    score += 10;
  }

  return {
    matchPercent: Math.round(Math.min(score, 100)),
    matchedSkillsTheyTeach: [...new Set(matchedSkillsTheyTeach)],
    matchedSkillsITeach: [...new Set(matchedSkillsITeach)],
  };
};

// ---------------------------------------------------------------
// @desc    Get recommended users for the logged-in user
// @route   GET /api/matches
// @access  Private
// ---------------------------------------------------------------
// We only fetch candidates who teach at least one skill the
// current user wants to learn - this keeps the query reasonably
// efficient by filtering at the database level before scoring in
// JS, rather than scoring every single user in the database
// regardless of relevance.
// ---------------------------------------------------------------
const getRecommendedUsers = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const myWants = normalize(currentUser.skillsToLearn);

    if (myWants.length === 0) {
      return res.status(200).json({
        matches: [],
        message: "Add skills you want to learn to your profile to get recommendations",
      });
    }

    const candidates = await User.find({
      _id: { $ne: currentUser._id },
      skillsToTeach: { $in: myWants },
      isActive: true,
    }).select("name profilePicture department bio skillsToTeach skillsToLearn location availability");

    const scored = candidates
      .map((candidate) => {
        const { matchPercent, matchedSkillsTheyTeach, matchedSkillsITeach } = calculateMatchScore(
          currentUser,
          candidate
        );
        return {
          user: candidate,
          matchPercent,
          matchedSkillsTheyTeach,
          matchedSkillsITeach,
        };
      })
      .filter((entry) => entry.matchPercent > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, 20); // cap results - this is "recommendations", not a full directory

    res.status(200).json({ matches: scored });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendedUsers };
