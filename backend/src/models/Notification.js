// backend/src/models/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    // Recipient of the notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // UI Title ("Order Shipped", "Order Cancelled", etc.)
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Description shown in notification panel
    message: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      default: null,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Notification category
    type: {
      type: String,
      enum: ["order", "system", "promo", "support", "chat"],
      default: "order",
      index: true,
    },

    // Visibility state
    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // Importance level
    priority: {
      type: Number,
      default: 3, // Normal
      min: 1,
      max: 5,
    },

    // For tracking delivery methods
    deliveredVia: [
      {
        type: String, // "email", "push", "sms"
      },
    ],

    // Associate with order if needed
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },

    // auto-delete
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Smart indexing
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

// TTL optional
// NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

NotificationSchema.methods.markAsRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this;
};

module.exports = mongoose.model("Notification", NotificationSchema);
