// backend/src/middlewares/rateLimit.js

const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, //Max 100 requests per window
    message: { message: "Too many requests, please try again later." }
});

module.exports = apiLimiter;
