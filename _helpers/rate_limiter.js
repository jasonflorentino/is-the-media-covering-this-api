const rateLimit = require("express-rate-limit");

const MINUTES = 15;

const ratelimiter = rateLimit({
  windowMs: MINUTES * 60 * 1000,
  max: 200 // max requests per windowMs
});

module.exports = ratelimiter;