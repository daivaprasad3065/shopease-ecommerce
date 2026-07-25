// backend/src/services/orderServices.js

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");
const CancelledOrder = require("../models/CancelledOrder");
const mongoose = require("mongoose");
const { 
    sendOrderNotifications,
    sendLowStockAlert, 
    sendCancellationEmailToUser, 
    sendCancellationAlertToAdmin,
    sendCancelRequestApprovedEmail,
    sendCancelRequestRejectedEmail,
    sendOrderStatusEmail,      
    sendAdminCancellationEmail,
    sendCancelRequestEmails } = require("../services/emailServices");
const { wrapEmailHTML, sendEmail } = require("../services/emailServices");
const { createNotification } = require("./notificationService");

// --- PROCESS ORDER ---
exports.processOrder = async (userId, { products, deliveryAddress, isPartialCheckout }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.isVerified) {
        throw new Error("Email not verified. Please verify your email before placing an order.");
    }

    // 2. Prevent Duplicates (Cooldown check)
    const cooldownTime = 5 * 60 * 1000; 
    const recentOrder = await Order.findOne({
        user: userId,
        status: { $in: ["Pending", "Processing"] },
        createdAt: { $gte: new Date(Date.now() - cooldownTime) }
    });

    if (recentOrder) {
        const recentProductIds = recentOrder.products.map(p => p.product.toString());
        const currentProductIds = products.map(p => p.product.toString());
        if (currentProductIds.some(pid => recentProductIds.includes(pid))) {
            throw new Error("Duplicate order detected. Please wait a few minutes before re-ordering.");
        }
    }

    let totalAmount = 0;
    let finalOrderProducts = []; 

    // 3. Process Each Item
    for (let item of products) {
        const productData = await Product.findById(item.product);
        if (!productData) throw new Error(`Product not found: ${item.product}`);

        let availableStock = productData.stock;
        let variantIndex = -1;

        if (productData.hasVariants) {
            variantIndex = productData.variants.findIndex(
                v => v.size === item.size && v.color === item.color
            );

            if (variantIndex === -1) {
                throw new Error(`Variant not found: ${productData.name} (Size: ${item.size}, Color: ${item.color})`);
            }
            availableStock = productData.variants[variantIndex].stock;
        }

        if (availableStock < item.quantity) {
            throw new Error(`Out of Stock: ${productData.name} (${item.size || ''} ${item.color || ''}). Only ${availableStock} left.`);
        }

        const itemPrice = productData.price; 
        totalAmount += itemPrice * item.quantity;

        if (productData.hasVariants && variantIndex > -1) {
            productData.variants[variantIndex].stock -= item.quantity;
            productData.stock -= item.quantity;
        } else {
            productData.stock -= item.quantity;
        }

        await productData.save();

        finalOrderProducts.push({
            product: productData._id,
            name: productData.name,
            quantity: item.quantity,
            size: item.size || null, 
            color: item.color || null,
            price: itemPrice, 
            image: productData.images[0] 
        });

        const currentStock = productData.hasVariants ? productData.variants[variantIndex].stock : productData.stock;
        if (currentStock <= 5) {
            sendLowStockAlert(productData).catch(err => console.error("Low stock alert failed", err));
        }
    }

    // 4. Format Address
    const formattedAddress = {
        line1: deliveryAddress.line1 || "",
        line2: deliveryAddress.line2 || "",
        city: deliveryAddress.city || "",
        state: deliveryAddress.state || "Andhra Pradesh",
        pincode: deliveryAddress.pincode || "",
        phone: deliveryAddress.phone || user.phone || "",
        alternatePhone: deliveryAddress.alternatePhone || "",
    };

    // 5. Create Order in DB
    const newOrder = await Order.create({
        user: userId,
        products: finalOrderProducts, 
        totalAmount,
        deliveryAddress: formattedAddress,
        status: "Pending",
        paymentMethod: "Cash on Delivery"
    });

    // 6. Manage Cart Deletion
    if (isPartialCheckout) {
        console.log("⚡ Partial Checkout: Removing specific items from cart...");
        
        for (const boughtItem of products) {
            await Cart.updateOne(
                { userId: userId },
                { 
                    $pull: { 
                        items: { 
                            productId: new mongoose.Types.ObjectId(boughtItem.product),
                            
                            size: boughtItem.size || null,
                            color: boughtItem.color || null
                        } 
                    } 
                }
            );
        }
        
        const cart = await Cart.findOne({ userId });
        if(cart) await cart.save(); 

    } else {
        console.log("🛒 Full Checkout: Deleting cart...");
        await Cart.deleteOne({ userId: userId });
    }

    // 7. Send Notifications
    await sendOrderNotifications(newOrder, user, formattedAddress, totalAmount, finalOrderProducts);

    // CREATE NOTIFICATION: Order Placed
    try {
        await createNotification({
            userId: user._id,
            title: "Order Placed Successfully",
            message: `Your order #${newOrder._id} has been placed.`,
            type: "order",
            orderId: newOrder._id,
            priority: 1,
            deliveredVia: ["email"]
        });
    } catch (err) {
        console.error("❌ Failed to create 'Order Placed' notification:", err);
    }


    return { order: newOrder, user, totalAmount, formattedAddress, updatedProducts: finalOrderProducts };
};

// --- STATUS UPDATES WITH REQUEST APPROVAL / REJECTION ---
exports.updateOrderStatus = async (orderId, status, reason = "") => {
    // FETCH ORDER FIRST WITH USER DETAILS
    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) throw new Error("Order not found");

    // If admin is responding to cancellation request:
    const hasPendingRequest =
        order.cancellationRequest &&
        order.cancellationRequest.status === "Pending";

    // ============================================================
    // CASE 1: ADMIN APPROVES CANCELLATION REQUEST
    // ============================================================
    if (status === "Cancelled" && hasPendingRequest) {
        // Update request status
        order.cancellationRequest.status = "Approved";
        order.cancellationRequest.adminReason = reason || "No reason provided";
        order.cancellationRequest.reviewedAt = new Date();

        // Archive into CancelledOrder
        await CancelledOrder.create({
            originalOrderId: order._id,
            user: order.user._id,
            products: order.products,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            deliveryAddress: order.deliveryAddress,
            trackingNumber: order.trackingNumber,
            courierPartner: order.courierPartner,

            cancellationSource: "User-Requested-Approved",
            userReason: order.cancellationRequest.reason,
            adminReason: reason || "No reason provided",
            reviewedAt: new Date(),
            cancelledAt: new Date(),
        });

        // RESTORE STOCK
        for (const item of order.products) {
            const product = await Product.findById(item.product);
            if (!product) continue;

            product.stock += item.quantity;

            if (product.hasVariants) {
                const idx = product.variants.findIndex(
                    v => v.size === item.size && v.color === item.color
                );
                if (idx > -1) {
                    product.variants[idx].stock += item.quantity;
                }
            }

            await product.save();
        }

        // DELETE ACTIVE ORDER
        await Order.findByIdAndDelete(orderId);

        // SEND APPROVED EMAIL
        await sendCancelRequestApprovedEmail(order, order.user);

        // CREATE NOTIFICATION: Cancellation Approved
        try {
            await createNotification({
                userId: order.user._id,
                title: "Cancellation Approved",
                message: `Your cancellation request for Order #${order._id} was approved.`,
                type: "order",
                orderId: order._id,
                priority: 1,
                deliveredVia: ["email"]
            });
        } catch (err) {
            console.error("❌ Failed to create 'Cancellation Approved' notification:", err);
        }

        return order;
    }

    // ============================================================
    // CASE 2: ADMIN REJECTS CANCELLATION REQUEST
    // ============================================================
    if (status === "Processing" && hasPendingRequest) {
        order.cancellationRequest.status = "Rejected";
        order.cancellationRequest.adminReason = reason || "Not specified";

        await order.save();

        // Send rejection email
        await sendCancelRequestRejectedEmail(order, order.user, reason);

        // CREATE NOTIFICATION: Cancellation Rejected
        try {
            await createNotification({
                userId: order.user._id,
                title: "Cancellation Request Rejected",
                message: `Your cancellation request for Order #${order._id} was rejected.`,
                type: "order",
                orderId: order._id,
                priority: 3,
                deliveredVia: ["email"]
            });
        } catch (err) {
            console.error("❌ Failed to create 'Cancellation Rejected' notification:", err);
        }

        return order;
    }

    // ============================================================
    // CASE 3: NORMAL STATUS UPDATE (Processing / Shipped / Delivered / Admin cancel)
    // ============================================================

    // 1. Prepare Update Object
    const updateData = { status };

    // If status is Delivered, capture the timestamp
    if (status === "Delivered") {
        updateData.deliveredAt = new Date();
    }

    // 2. Perform Update
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        updateData,
        { new: true }
    ).populate("user", "name email");

    // 3. CREATE NOTIFICATION: Status Update
    try {
        await createNotification({
            userId: updatedOrder.user._id,
            title: `Order ${status}`,
            message: `Your order #${updatedOrder._id} is now ${status}.`,
            type: "order",
            orderId: updatedOrder._id,
            priority: 2,
            deliveredVia: ["email"]
        });
    } catch (err) {
        console.error("❌ Failed to create 'Order Status Update' notification:", err);
    }

    // 4. Send Emails
    // If admin manually cancels order (NOT request-based)
    if (status === "Cancelled" && !hasPendingRequest) {
        await sendAdminCancellationEmail(updatedOrder, updatedOrder.user, reason);
    } else {
        await sendOrderStatusEmail(updatedOrder, updatedOrder.user);
    }

    return updatedOrder;
};

// --- BULK STATUS UPDATES ---
exports.bulkUpdateOrderStatus = async (orderIds, status) => {
    if (!Array.isArray(orderIds) || orderIds.length === 0) throw new Error("No orders provided for bulk update");
    
    const validStatuses = ["Processing", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) throw new Error("Invalid order status");
    
    const updatedOrders = await Order.updateMany({ _id: { $in: orderIds } }, { status }, { new: true });
    
    const orders = await Order.find({ _id: { $in: orderIds } }).populate("user", "name email");
    for (const order of orders) {
        const htmlString = wrapEmailHTML(
            "Order Status Updated",
            `<p>Hi ${order.user.name}, your order <b>#${order._id}</b> is now <b>${status}</b>.</p>`
        );

        await sendEmail(order.user.email, `Order ${status}: #${order._id}`, htmlString);

    }
    
    return orders;
};

// --- USER REQUESTS CANCELLATION (For Processing orders) ---
exports.requestCancellationByUser = async (orderId, reason) => {
    // 1. Fetch order with user data
    const order = await Order.findById(orderId).populate('user');
    if (!order) throw new Error("Order not found");

    // 2. Allow cancellation request ONLY if order is in Processing
    if (order.status !== "Processing") {
        throw new Error("Cancellation request is only valid for Processing orders.");
    }

    // 3. Store cancellation request (Reason, Time, and Status)
    order.cancellationRequest = {
        reason,
        requestedAt: new Date(),
        status: "Pending" 
    };

    await order.save(); // --- Save changes to DB ---

    // 4. Trigger BOTH admin + user email notifications
    await sendCancelRequestEmails(order, order.user, reason);

    // CREATE NOTIFICATION: Cancellation Request Submitted
    try {
        await createNotification({
            userId: order.user._id,
            title: "Cancellation Request Submitted",
            message: `Your request for Order #${order._id} is under admin review.`,
            type: "order",
            orderId: order._id,
            priority: 2,
            deliveredVia: ["email"]
        });
    } catch (err) {
        console.error("❌ Failed to create 'Cancellation Request' notification:", err);
    }

    // 5. Send response to user
    return { 
        message: "Cancellation request sent successfully",
        status: "pending_admin_review"
    };
};

// --- CANCEL ORDER ---
exports.cancelOrderByUser = async (orderId) => {
    const order = await Order.findById(orderId).populate("user");
    if (!order) throw new Error("Order not found");
    if (order.status !== "Pending")
        throw new Error("Cannot cancel an order that is already processed");

    // 1. Archive into CancelledOrder
    await CancelledOrder.create({
        originalOrderId: order._id,
        user: order.user._id,
        products: order.products,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        cancellationSource: "User-Cancelled",
        userReason: null,
        adminReason: null,
        reviewedAt: null,
        cancelledAt: new Date(),
    });

    // 2. Restore stock
    for (const item of order.products) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        product.stock += item.quantity;

        if (product.hasVariants) {
            const variantIndex = product.variants.findIndex(
                (v) => v.size === item.size && v.color === item.color
            );
            if (variantIndex > -1)
                product.variants[variantIndex].stock += item.quantity;
        }

        await product.save();
    }

    // 3. Delete active order
    await Order.findByIdAndDelete(orderId);

    // 4. Notify (fails silently if email fails)
    Promise.all([
        sendCancellationEmailToUser(order, order.user),
        sendCancellationAlertToAdmin(order, order.user),
    ]).catch(() => {});

    // 5. Create Notification: Order Cancelled
    try {
        await createNotification({
            userId: order.user._id,
            title: "Order Cancelled",
            message: `You cancelled order #${order._id}. Refund is not applicable for COD.`,
            type: "order",
            orderId: order._id,
            priority: 2,
            deliveredVia: ["email"]
        });
    } catch (err) {
        console.error("❌ Failed to create 'Order Cancelled' notification:", err);
    }

    return order;
};

// --- BULK CANCEL ---
exports.bulkCancelOrdersByAdmin = async (orderIds) => {
    if (!Array.isArray(orderIds) || orderIds.length === 0) throw new Error("No orders provided for bulk cancel");
    
    const cancelledOrders = [];
    
    for (const orderId of orderIds) {
        const order = await Order.findById(orderId).populate('user');
        
        if (!order) continue;
        // Safety Check
        if (order.status !== "Pending") continue; 

        // 1. Archive
        await CancelledOrder.create({
            originalOrderId: order._id,
            user: order.user._id,
            products: order.products,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            deliveryAddress: order.deliveryAddress,
            cancellationSource: "Admin",
            cancelledAt: new Date()
        });

        // ==================================================
        // 2. RESTORE STOCK 
        // ==================================================
        for (const item of order.products) {
            const product = await Product.findById(item.product);
            
            if (product) {
                // A. Restore Global Stock
                product.stock += item.quantity;

                // B. Restore Variant Stock
                if (product.hasVariants) {
                    const variantIndex = product.variants.findIndex(v => 
                        v.size === item.size && v.color === item.color
                    );
                    
                    if (variantIndex > -1) {
                        product.variants[variantIndex].stock += item.quantity;
                    }
                }
                
                await product.save();
            }
        }

        // 3. Delete
        await Order.findByIdAndDelete(orderId);

        // 4. Notify User
        if (order.user) {
            sendCancellationEmailToUser(order, order.user)
                .catch(err => console.error(`Failed to send cancel email to ${order.user.email}:`, err));
        }

        cancelledOrders.push(order);
    }
    
    return cancelledOrders;
};