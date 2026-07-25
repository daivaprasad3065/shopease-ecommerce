// backend/src/controllers/orderController.js

const Order = require("../models/Order");
const CancelledOrder = require("../models/CancelledOrder");
const { successResponse, errorResponse } = require("../middlewares/responseHandler");
const { validateOrderRequest } = require("../validations/orderValidation");
const { processOrder, updateOrderStatus, cancelOrderByUser, bulkUpdateOrderStatus, bulkCancelOrdersByAdmin, requestCancellationByUser } = require("../services/orderServices");

// Placing a new order (Only for email verified users)
exports.createOrder = async (req, res, next) => {
    try {
        // Validate request data
        const validationError = validateOrderRequest(req.body);
        if (validationError) return errorResponse(res, validationError, 400);

        // Process the order (stock reduction, low stock alerts, notifications) the service handles everything
        const { order } = await processOrder(req.user.id, req.body);

        // Return success response
        return successResponse(res, "Order placed successfully!", { order }, 201);
    } catch (error) {
        console.error("❌ Order Processing Error:", error);
        next(error);
    }
};

// GET FULL ORDER DETAILS (Robust Version)
exports.getOrderDetails = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // 1. Fetch Order & Populate Data
        const order = await Order.findById(orderId)
            .populate("user", "name email phone")
            .populate({
                path: "products.product",
                select: "name slug images brand category" 
            });

        if (!order) {
            return errorResponse(res, "Order not found", 404);
        }

        // 2. Security Check 
        // Allow if User is Admin OR if the Order belongs to the logged-in User
        if (req.user.role !== "admin" && order.user._id.toString() !== req.user.id) {
            return errorResponse(res, "Access denied. You cannot view this order.", 403);
        }

        return successResponse(res, "Order details retrieved successfully", { order });
    } catch (error) {
        next(error);
    }
};

// Getting list of all orders of a specific user
exports.getUserOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { year, month } = req.query;
        
        let query = { user: req.user.id };

        if (year) {
            let startDate, endDate;
            const yearNum = parseInt(year);

            if (month) {
                // Filter by specific Month (month is 1-12)
                const monthIndex = parseInt(month) - 1; 
                
                // Start of the month
                startDate = new Date(yearNum, monthIndex, 1);
                // End of the month (0th day of next month gets the last day of current)
                endDate = new Date(yearNum, monthIndex + 1, 0, 23, 59, 59, 999);
            } else {
                // Filter by entire Year (Jan 1 - Dec 31)
                startDate = new Date(yearNum, 0, 1);
                endDate = new Date(yearNum, 11, 31, 23, 59, 59, 999);
            }

            query.createdAt = {
                $gte: startDate,
                $lte: endDate
            };
        }

        // 4. Fetch Results
        const [orders, totalOrders] = await Promise.all([
            Order.find(query)
                .populate("products.product", "name slug images")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }), // Newest first
            Order.countDocuments(query)
        ]);

        return successResponse(res, "Orders retrieved successfully", {
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            totalOrders,
            orders
        });
    } catch (error) {
        next(error);
    }
};

// Getting list of all orders with filtering and pagination (For Admin Only)
exports.getAllOrders = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return errorResponse(res, "Access denied. Admins only.", 403);
        }

        const { page = 1, limit = 10, status, user, startDate, endDate } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const skip = (pageNum - 1) * limitNum;

        // BUIDLING the filter query
        let filter = {};

        if (status) {
            filter.status = { $regex: new RegExp(status, "i") };   // Case-insensitive match
        }

        if (user) {
            filter.user = user; 
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Fetching orders with filters, pagination, and sorting
        const [orders, totalOrders] = await Promise.all([
            Order.find(filter)
                .populate("user", "name email phone")
                .populate("products.product", "name")
                .skip(skip)
                .limit(limitNum)
                .sort({ createdAt: -1 }),
            Order.countDocuments(filter)
        ]);

        return successResponse(res, "Orders retrieved successfully", {
            totalPages: Math.ceil(totalOrders / limitNum),
            currentPage: pageNum,
            orders,
            totalOrders
        });
    } catch (error) {
        next(error);
    }
};

// Updating the order status by Admin (Pending -> Accepted -> Processing -> Shipped -> Delivered)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return errorResponse(res, "Access denied. Admins only.", 403);
        }

        const { orderId } = req.params;
        const { status, reason, adminReason } = req.body;
        const finalReason = reason || adminReason || null;

        const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return errorResponse(res, "Invalid order status", 400);
        }

        const order = await updateOrderStatus(orderId, status, finalReason);

        return successResponse(res, "Order status updated successfully", { order });
    } catch (error) {
        next(error);
    }
};

// Bulk update order statuses (Admin only)
exports.bulkUpdateOrderStatus = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return errorResponse(res, "Access denied. Admins only.", 403);
        }

        const { orderIds, status } = req.body;

        const orders = await bulkUpdateOrderStatus(orderIds, status);

        return successResponse(res, "Orders updated successfully", { orders });
    } catch (error) {
        next(error);
    }
};

// Cancelling an order (User can cancel only if status is 'Pending') - uses the service
exports.cancelOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await cancelOrderByUser(orderId);
        return successResponse(res, "Order cancelled and moved to archive", { order });
    } catch (error) {
        next(error);
    }
};

// Bulk cancelling orders (Admin only) - uses the service
exports.bulkCancelOrders = async (req, res, next) => {
    try {
        const { orderIds } = req.body; // expect array of order IDs
        const orders = await bulkCancelOrdersByAdmin(orderIds);
        return successResponse(res, "Orders cancelled successfully", { orders });
    } catch (error) {
        next(error);
    }
};

//  USER REQUESTS CANCELLATION FOR PROCESSING ORDER 
exports.requestCancel = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        if (!reason || reason.trim().length === 0) {
            return errorResponse(res, "Cancellation reason is required.", 400);
        }

        const result = await requestCancellationByUser(orderId, reason);

        return successResponse(res, "Cancellation request sent.", result);
    } catch (error) {
        next(error);
    }
};

// Getting list of all cancelled orders with pagination (Admin only)
exports.getAllCancelledOrders = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return errorResponse(res, "Access denied. Admins only.", 403);
        }

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const [cancelledOrders, totalCancelledOrders] = await Promise.all([
            CancelledOrder.find()
                .populate("user", "name email")
                .populate("products.product", "name price")
                .skip(skip)
                .limit(limit)
                .sort({ updatedAt: -1 }),
            CancelledOrder.countDocuments()
        ]);

        return successResponse(res, "Cancelled orders retrieved successfully", {
            totalCancelledOrders,
            totalPages: Math.ceil(totalCancelledOrders / limit),
            currentPage: page,
            cancelledOrders
        });
    } catch (error) {
        next(error);
    }
};

// Clear all cancelled orders (Admin only)
exports.clearAllCancelledOrders = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return errorResponse(res, "Access denied. Admins only.", 403);
        }

        const result = await CancelledOrder.deleteMany({});
        if (result.deletedCount === 0) {
            return successResponse(res, "No cancelled orders to delete");
        }

        return successResponse(res, `Deleted ${result.deletedCount} cancelled orders`);
    } catch (error) {
        next(error);
    }
};

// Deleting a specific cancelled order (Admin only)
exports.deleteSpecificCancelledOrder = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return errorResponse(res, "Access denied. Admins only.", 403);
        }

        const { orderId } = req.params;

        const order = await CancelledOrder.findById(orderId);
        if (!order) {
            return errorResponse(res, "Cancelled order not found", 404);
        }

        await CancelledOrder.findByIdAndDelete(orderId);
        return successResponse(res, "Cancelled order deleted successfully");
    } catch (error) {
        next(error);
    }
};

// Tracking order status & estimated delivery
exports.trackOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ _id: orderId, user: req.user.id });

        if (!order) {
            return errorResponse(res, "Order not found", 404);
        }

        return successResponse(res, "Order details fetched", {
            status: order.status,
            estimatedDelivery: order.estimatedDelivery,
        });
    } catch (error) {
        next(error);
    }
};

// Order Insights (Admin)
exports.getOrderInsights = async (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "admin") return errorResponse(res, "Access denied.", 403);
  
      // Total Sales & Orders
      const totalOrders = await Order.countDocuments();
      const totalRevenue = await Order.aggregate([
        { $match: { status: "Delivered" } },  
        { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }
      ]);
  
      // Orders Breakdown
      const orderStatusCounts = await Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
  
      // Recent Sales (Last 30 Days)
      const recentSales = await Order.aggregate([
        { 
          $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } 
        },
        { 
          $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      // Top-Selling Products
      // Note: This groups by the Product ID.
      const topProducts = await Order.aggregate([
        { $unwind: "$products" },
        { 
          $group: { 
            _id: "$products.product",
            name: { $first: "$products.name" },  
            totalSold: { $sum: "$products.quantity" }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ]);
  
      // Top Customers
      const topCustomers = await Order.aggregate([
        { 
          $group: { 
            _id: "$user", 
            totalSpent: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userInfo"
          }
        }
      ]);
  
      return successResponse(res, "Order insights retrieved", {
        totalOrders,
        totalRevenue: totalRevenue.length ? totalRevenue[0].revenue : 0,
        orderStatusCounts,
        recentSales,
        topProducts,
        topCustomers
      });
  
    } catch (error) {
      next(error);
    }
};