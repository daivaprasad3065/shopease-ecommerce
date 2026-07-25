// backend/src/controllers/notificationController.js

const {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../services/notificationService");

const { successResponse, errorResponse } = require("../middlewares/responseHandler");

// GET USER NOTIFICATIONS (Paginated)
exports.getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 20);

    const data = await getUserNotifications(req.user._id, page, limit);

    return successResponse(res, "Notifications fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

// GET UNREAD NOTIFICATION COUNT
exports.getUnreadNotificationsCount = async (req, res, next) => {
  try {
    const count = await getUnreadCount(req.user._id);

    return successResponse(res, "Unread notifications count fetched", { count });
  } catch (error) {
    next(error);
  }
};

// MARK A SINGLE NOTIFICATION AS READ
exports.readNotification = async (req, res, next) => {
  try {
    const { id: notificationId } = req.params;

    if (!notificationId) {
      return errorResponse(res, "Notification ID is required", 400);
    }

    const updated = await markAsRead(notificationId, req.user._id);

    if (!updated) {
      return errorResponse(res, "Notification not found or access denied", 404);
    }

    return successResponse(res, "Notification marked as read", { notification: updated });
  } catch (error) {
    next(error);
  }
};

// MARK ALL NOTIFICATIONS AS READ
exports.readAllNotifications = async (req, res, next) => {
  try {
    await markAllAsRead(req.user._id);
    return successResponse(res, "All notifications marked as read");
  } catch (error) {
    next(error);
  }
};

//  CREATE NOTIFICATION MANUALLY — Admin or System Use
exports.createNotificationController = async (req, res, next) => {
  try {
    const { title, message, link, userId } = req.body;

    if (!title || !message || !userId) {
      return errorResponse(res, "Title, message, and userId are required", 400);
    }

    const notification = await createNotification({
      userId,
      title,
      message,
      link,
    });

    return successResponse(res, "Notification created", { notification }, 201);
  } catch (error) {
    next(error);
  }
};
