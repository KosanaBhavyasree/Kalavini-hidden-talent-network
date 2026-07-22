const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ---------------------------------------------------------------
// protect
// ---------------------------------------------------------------
// This is route middleware - it runs BEFORE the actual controller
// for any route it's attached to (e.g. router.get("/profile",
// protect, getProfile)).
//
// What it does:
//   1. Reads the Authorization header, expects format:
//        "Bearer <token>"
//   2. Verifies the token's signature using JWT_SECRET. If the
//      token was tampered with, expired, or never issued by us,
//      jwt.verify() throws - we catch that and respond 401.
//   3. Looks up the user in MongoDB by the id stored in the token
//      payload, and attaches it to req.user (excluding the
//      password field).
//   4. Calls next() so the actual controller can run, now with
//      req.user available.
//
// Any controller that uses `protect` can safely assume req.user
// is a real, currently-existing user document.
// ---------------------------------------------------------------
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token provided",
    });
  }

  try {
    // Throws if the token is invalid, malformed, or expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user without the password field. If the user was
    // deleted after the token was issued, this will be null.
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Distinguish an expired token from other failures so the
    // frontend can show a clearer message if it wants to.
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please log in again" });
    }
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
