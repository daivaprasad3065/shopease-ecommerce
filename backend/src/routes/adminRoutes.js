// backend/src/routes/adminRoutes.js

const express = require("express");
const {
  registerAdmin, loginAdmin, getAdminDashboard,
  getAllUsers, getUserById, updateUser, deleteUser, bulkDeleteUsers, 
  UserStatus, blockUser, unblockUser, getBlockedUsers,
  bulkBlockUsers, bulkUnblockUsers,
} = require("../controllers/adminController");

const { adminViewUserCart } = require("../controllers/cartController");
const { adminViewUserWishlist } = require("../controllers/wishlistController");
const { getOrderInsights } = require("../controllers/orderController");
const { isAdmin } = require("../middlewares/adminVerification");

const router = express.Router();

// Auth (Public)
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/dashboard", isAdmin, getAdminDashboard); 

// Insights
router.get("/orders/insights", isAdmin, getOrderInsights);

// User Management 
router.get("/users", isAdmin, getAllUsers);
router.delete("/users/bulk-delete", isAdmin, bulkDeleteUsers); 
router.put("/users/bulk-block", isAdmin, bulkBlockUsers);     
router.put("/users/bulk-unblock", isAdmin, bulkUnblockUsers); 
router.get("/blocked-users", isAdmin, getBlockedUsers);       

// Specific User Ops
router.get("/users/:id", isAdmin, getUserById);
router.put("/users/:id", isAdmin, updateUser);
router.put("/users/:id/toggle-status", isAdmin, UserStatus);
router.delete("/users/:id", isAdmin, deleteUser);

// Block/Unblock
router.put("/users/block/:id", isAdmin, blockUser);
router.put("/users/unblock/:id", isAdmin, unblockUser);

// View User Data
router.get("/users/:id/cart", isAdmin, adminViewUserCart);
router.get("/users/:id/wishlist", isAdmin, adminViewUserWishlist);

module.exports = router;