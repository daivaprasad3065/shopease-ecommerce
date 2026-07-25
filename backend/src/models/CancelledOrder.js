// backend/src/models/CancelledOrder.js

const mongoose = require("mongoose");

const CancelledOrderSchema = new mongoose.Schema(
{
    originalOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },

    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },

    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            quantity: Number,
            size: String,
            color: String,
            price: Number,
        },
    ],

    totalAmount: Number,
    paymentMethod: String,

    deliveryAddress: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
        alternatePhone: String,
    },

    cancellationSource: {
        type: String,
        enum: ["User-Cancelled", "User-Requested-Approved", "Admin-Cancelled"],
        required: true,
    },

    userReason: { type: String, default: null }, // Why user requested cancellation
    adminReason: { type: String, default: null }, // Why admin forced cancellation
    reviewedAt: { type: Date, default: null },    // When admin approved/rejected

    trackingNumber: { type: String, default: null },
    courierPartner: { type: String, default: null },

    cancelledAt: { 
        type: Date, 
        default: Date.now 
    },

},
{ timestamps: true }
);

module.exports = mongoose.model("CancelledOrder", CancelledOrderSchema);
