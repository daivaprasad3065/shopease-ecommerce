// backend/src/routes/orderRoutes.js

const express = require("express");
const { 
    createOrder, getUserOrders, getAllOrders, 
    updateOrderStatus, bulkUpdateOrderStatus, bulkCancelOrders,
    cancelOrder, getAllCancelledOrders, clearAllCancelledOrders, deleteSpecificCancelledOrder,
    requestCancel,
    getOrderDetails
} = require("../controllers/orderController");

const protect = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/adminVerification");
const rateLimit = require("../middlewares/rateLimit");

const router = express.Router();

router.use(rateLimit); 

// --- ADMIN ROUTES ---
router.get("/all", isAdmin, getAllOrders); 
router.get("/cancelled", isAdmin, getAllCancelledOrders); 
router.delete("/cancelled/all", isAdmin, clearAllCancelledOrders);   
router.delete("/cancelled/:orderId", isAdmin, deleteSpecificCancelledOrder);
router.put("/admin/orders/bulk-update", isAdmin, bulkUpdateOrderStatus); 
router.put("/admin/orders/bulk-cancel", isAdmin, bulkCancelOrders); 

// --- USER ROUTES ---
router.post("/", protect, createOrder); 
router.get("/", protect, getUserOrders);
router.post("/request-cancel/:orderId", protect, requestCancel);

// --- DYNAMIC ROUTES (ID Based) ---
router.get("/:orderId", protect, getOrderDetails); 
router.delete("/:orderId", protect, cancelOrder);
router.put("/:orderId", isAdmin, updateOrderStatus);

module.exports = router;