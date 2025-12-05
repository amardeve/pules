const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function generateToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

