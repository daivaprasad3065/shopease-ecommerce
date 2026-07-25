const express = require("express");
const { addToCart, updateCartItem, removeFromCart, viewCart } = require("../controllers/cartController");
const protect = require("../middlewares/auth"); 

const router = express.Router();

router.post("/add", protect, addToCart);// For Adding item to cart 
router.patch("/update/:productId", protect, updateCartItem); // For Updating item quantity in cart
router.delete("/remove/:productId", protect, removeFromCart); // For Removing item from cart

// View cart 
router.get("/", protect, viewCart);

module.exports = router;
