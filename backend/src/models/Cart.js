const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: { 
          type: String 
        },  // e.g., "M"
        color: { 
          type: String 
        }, // e.g., "Red"
        priceAtPurchase: {
          type: Number,
          required: true, 
        },
        mrpAtPurchase: { 
          type: Number,
          required: true
        },
        discountAtPurchase: {
          type: Number,
          required: true
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0, 
    },
    totalMRP: {
      type: Number,
      required: true,
      default: 0, 
    },
    totalAdditionalDiscount: {
      type: Number,
      required: true,
      default: 0, 
    },
    isOrdered: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

// Automatically calculate totals before saving the cart
cartSchema.pre("save", function (next) {
  let finalTotal = 0;
  let mrpTotal = 0;
  let additionalDiscountTotal = 0;

  this.items.forEach(item => {
    // 1. Calculate Base Total for this item (Price * Qty)
    const baseTotal = item.priceAtPurchase * item.quantity;
    
    // 2. Calculate Additional Discount Amount for this item
    // Formula: (Price * Qty) * (Discount% / 100)
    const extraDiscountAmount = Math.round((baseTotal * item.discountAtPurchase) / 100);
    
    // 3. Set Item's Final Price
    item.totalPrice = baseTotal - extraDiscountAmount;

    // 4. Update Cart Totals
    mrpTotal += (item.mrpAtPurchase * item.quantity);
    finalTotal += item.totalPrice;
    additionalDiscountTotal += extraDiscountAmount;
  });

  this.totalAmount = finalTotal;
  this.totalMRP = mrpTotal;
  this.totalAdditionalDiscount = additionalDiscountTotal; // Store this for the UI

  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
