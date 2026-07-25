// backend/src/controllers/cartController.js

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { successResponse, errorResponse } = require("../middlewares/responseHandler");

// 1. Add Item to Cart (Handles Variants)
exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, size, color } = req.body;

    if (!productId || quantity <= 0) {
      return errorResponse(res, "Product ID and valid quantity are required", 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    // --- VARIANT VALIDATION & STOCK CHECK ---
    let stockAvailable = product.stock; 

    if (product.hasVariants) {
      if (!size || !color) {
        return errorResponse(res, "Please select Size and Color", 400);
      }

      // Find the specific variant
      const variant = product.variants.find(
        (v) => v.size === size && v.color === color
      );

      if (!variant) {
        return errorResponse(res, "Selected variant (Size/Color) not available", 400);
      }
      
      stockAvailable = variant.stock;
    }

    // Check if requested quantity exceeds available stock
    if (quantity > stockAvailable) {
        return errorResponse(res, `Out of stock! Only ${stockAvailable} remaining.`, 400);
    }

    // --- CART LOGIC ---
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if THIS SPECIFIC VARIANT is already in cart
    const existingItemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId && 
        item.size === size && 
        item.color === color
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > stockAvailable) {
        return errorResponse(res, `Cannot add more. You already have ${cart.items[existingItemIndex].quantity} in cart and only ${stockAvailable} are available.`, 400);
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].totalPrice = newQuantity * product.price;
    } else {
      cart.items.push({
        productId,
        quantity,
        size: size || null,   
        color: color || null,
        priceAtPurchase: product.price,
        mrpAtPurchase: product.mrp,
        discountAtPurchase: product.discount || 0,
        totalPrice: quantity * product.price
      });
    }

    // Recalculate Totals
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.totalMRP = cart.items.reduce((sum, item) => sum + (item.mrpAtPurchase * item.quantity), 0);

    // Save & Populate
    await cart.save();
    await cart.populate({
        path: "items.productId",
        select: "name price images brand category",
        populate: { path: "category", select: "name" }
    });
    
    return successResponse(res, "Product added to cart", { cart });
  } catch (error) {
    next(error);
  }
};

// 2. Update Cart Item Quantity
exports.updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity, size, color } = req.body; 

    if (quantity <= 0) return errorResponse(res, "Quantity must be greater than 0", 400);

    let cart = await Cart.findOne({ userId });
    if (!cart) return errorResponse(res, "Cart not found", 404);

    // Find specific item
    const item = cart.items.find(item => 
        item.productId.toString() === productId &&
        (item.size === size || (!item.size && !size)) && 
        (item.color === color || (!item.color && !color))
    );

    if (!item) return errorResponse(res, "Product variant not found in cart", 404);

    // Update
    item.quantity = quantity;
    item.totalPrice = quantity * item.priceAtPurchase;

    // Recalculate Total
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.totalMRP = cart.items.reduce((sum, item) => sum + (item.mrpAtPurchase * item.quantity), 0);

    await cart.save();
    await cart.populate("items.productId", "name price images brand category");

    return successResponse(res, "Cart item updated", { cart });
  } catch (error) {
    next(error);
  }
};

// 3. Remove Item
exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { size, color } = req.body; 

    let cart = await Cart.findOne({ userId });
    if (!cart) return errorResponse(res, "Cart not found", 404);

    // Filter out the specific variant
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => 
        !(item.productId.toString() === productId && 
          item.size === size && 
          item.color === color)
    );

    if (cart.items.length === initialLength) {
        return errorResponse(res, "Item not found in cart", 404);
    }

    if (cart.items.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return successResponse(res, "Product removed, cart empty");
    }

    // Recalculate
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.totalMRP = cart.items.reduce((sum, item) => sum + (item.mrpAtPurchase * item.quantity), 0);

    await cart.save();
    await cart.populate("items.productId", "name price images brand category");
    
    return successResponse(res, "Product removed from cart", { cart });
  } catch (error) {
    next(error);
  }
};

// 4. View Cart
exports.viewCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId", "name price images brand category");

    if (!cart || cart.items.length === 0) return errorResponse(res, "Cart is empty", 404);

    return successResponse(res, "Cart retrieved", { cart });
  } catch (error) {
    next(error);
  }
};

// 5. Admin View Cart
exports.adminViewUserCart = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") return errorResponse(res, "Access denied", 403);
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId", "name price");
    if (!cart) return errorResponse(res, "Cart not found", 404);
    return successResponse(res, "User's cart retrieved", { cart });
  } catch (error) {
    next(error);
  }
};