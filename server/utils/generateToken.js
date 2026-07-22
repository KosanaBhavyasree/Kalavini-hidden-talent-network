const jwt = require("jsonwebtoken");

// ---------------------------------------------------------------
// generateToken
// ---------------------------------------------------------------
// Creates a signed JWT containing the user's MongoDB _id.
// We deliberately put ONLY the id in the token payload - never the
// password or other sensitive fields - because JWT payloads are
// base64-encoded, NOT encrypted. Anyone with the token can decode
// and read the payload, they just can't forge a valid signature
// without the JWT_SECRET.
//
// The token expires in 30 days. When it expires, the axios
// interceptor we set up in the client (src/services/api.js) will
// catch the resulting 401 and clear the stored session.
//
// Usage: const token = generateToken(user._id);
// ---------------------------------------------------------------
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    // Fail loudly in development if the secret is missing, rather
    // than silently signing tokens with `undefined` as the secret.
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
