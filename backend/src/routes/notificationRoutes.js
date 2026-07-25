// backend/src/routes/notificationRoutes.js

const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth");
const {
  getNotifications,
  getUnreadNotificationsCount,
  readNotification,
  readAllNotifications,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadNotificationsCount);
router.put("/:id/mark-read", protect, readNotification);
router.put("/mark-read", protect, readAllNotifications);

module.exports = router;
