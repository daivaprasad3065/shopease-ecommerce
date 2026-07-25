const mongoose = require("mongoose");

const cancellationSchema = new mongoose.Schema(
  {
    reason: { type: String, default: null },
    requestedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: null,       
    },
    adminReason: { type: String, default: null },
    reviewedAt: { type: Date, default: null }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },

        size: { type: String },  // Optional — some products don't need size
        color: { type: String },

        price: { type: Number, required: true }, // Price at time of purchase
        image: { type: String }
      },
    ],

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery"],
      default: "Cash on Delivery",
    },

    deliveryAddress: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, default: "Andhra Pradesh" },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
      alternatePhone: { type: String },
    },

    cancellationRequest: {
      type: cancellationSchema,
      default: null          // FIX: Do NOT auto-create
    },

    createdAt: { 
      type: Date, 
      default: Date.now 
    },

    estimatedDelivery: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      },
    },

    deliveredAt: { 
      type: Date,
      default: null 
    },

    trackingNumber: { type: String, default: null },
    courierPartner: { type: String, default: null }
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
