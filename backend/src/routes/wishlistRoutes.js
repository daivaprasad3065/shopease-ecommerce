const express = require("express");
const { 
    addToWishlist, 
    removeFromWishlist, 
    viewWishlist, 
    moveToCart, 
    clearWishlist
} = require("../controllers/wishlistController");
const protect = require("../middlewares/auth");

const router = express.Router();

// Wishlist Management Routes
router.post("/add", protect, addToWishlist); 
router.delete("/remove/:productId", protect, removeFromWishlist);

// Viewing wishlist
router.get("/", protect, viewWishlist); 

// Moving item from wishlist to cart
router.post("/move-to-cart/:productId", protect, moveToCart);

// Clearing the wishlist
router.delete("/clear", protect, clearWishlist);

module.exports = router;
