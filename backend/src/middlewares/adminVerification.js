// backend/src/middlewares/adminVerification.js

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Too many requests, please try again later." },
});

const isAdmin = async (req, res, next) => {
  try {
    console.log("Middleware Triggered: isAdmin");

    const token = req.headers.authorization?.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
      console.log("No Token Provided!");
      return res.status(401).json({ message: "Access denied! No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    console.log("Decoded Token:", decoded);

    if (!decoded.id) {
      console.log("Invalid Token! No ID found.");
      return res.status(403).json({ message: "Invalid or expired token!" });
    }

    // Using Admin model to find admin
    const user = await Admin.findById(decoded.id).select("role");
    console.log("Fetched User:", user);

    if (!user) {
      console.log("User Not Found in DB!");
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.role !== "admin") {
      console.log("User is not an Admin!");
      return res.status(403).json({ message: "You do not have admin privileges!" });
    }

    req.user = user;
    console.log("Admin Authenticated:", user);
    next();
  } catch (error) {
    console.log("Error in isAdmin Middleware:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { isAdmin, authLimiter };
