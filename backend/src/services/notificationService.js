// backend/src/services/notificationService.js

const Notification = require("../models/Notification");

/* ============================================================
   CREATE NOTIFICATION
   ============================================================ */
exports.createNotification = async ({
  userId,
  title,
  message,
  type = "order",
  orderId = null,
  link = null,
  payload = null,
  priority = 3,
  deliveredVia = [],
}) => {
  return Notification.create({
    user: userId,
    title,
    message,
    type,
    orderId,
    link,
    payload,
    priority,
    deliveredVia,
  });
};

/* ============================================================
   GET USER NOTIFICATIONS
   ============================================================ */
exports.getUserNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ user: userId })
    .sort({ read: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ user: userId });

  return {
    notifications,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/* ============================================================
   GET UNREAD COUNT
   ============================================================ */
exports.getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user: userId, read: false });
};

/* ============================================================
   MARK ONE AS READ
   ============================================================ */
exports.markAsRead = async (notificationId, userId) => {
  const notif = await Notification.findOne({ _id: notificationId, user: userId });
  if (!notif) throw new Error("Notification not found");

  notif.markAsRead();
  await notif.save();

  return notif;
};

/* ============================================================
   MARK ALL AS READ
   ============================================================ */
exports.markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
  return true;
};
