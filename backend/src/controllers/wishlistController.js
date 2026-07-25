// backend/src/controllers/wishlistController.js

const Wishlist = require("../models/Wishlist");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { successResponse, errorResponse } = require("../middlewares/responseHandler");

// Add to Wishlist
exports.addToWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, size, color } = req.body;

        if (!productId) return errorResponse(res, "Product ID is required", 400);

        const product = await Product.findById(productId);
        if (!product) return errorResponse(res, "Product not found", 404);

        // Validating variant only if product hasVariants
        if (product.hasVariants) {
            const existsVariant = product.variants.some(v =>
                v.size === size && v.color === color
            );

            if (!existsVariant) {
                return errorResponse(res, "Invalid size or color selected", 400);
            }
        }

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) wishlist = new Wishlist({ userId, items: [] });

        const exists = wishlist.items.some(item =>
            item.productId.toString() === productId &&
            item.size === size &&
            item.color === color
        );

        if (exists) return errorResponse(res, "Item already in wishlist", 400);

        wishlist.items.push({ productId, size, color });
        await wishlist.save();

        return successResponse(res, "Added to wishlist", { items: wishlist.items });

    } catch (error) {
        next(error);
    }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { size, color } = req.body;

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) return errorResponse(res, "Wishlist not found", 404);

        // Filter out specific item
        wishlist.items = wishlist.items.filter(item => 
            !(item.productId.toString() === productId && 
              item.size === size && 
              item.color === color)
        );

        if (wishlist.items.length === 0) {
            await Wishlist.deleteOne({ userId });
            return successResponse(res, "Wishlist is now empty");
        }

        await wishlist.save();
        return successResponse(res, "Removed from wishlist", { wishlist });
    } catch (error) {
        next(error);
    }
};

// Viewing the wishlist
exports.viewWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ userId }).populate("items.productId", "name price mrp discount images stock hasVariants variants")

        if (!wishlist || wishlist.items.length === 0) {
            return errorResponse(res, "Wishlist is empty", 404);
        }

        return successResponse(res, "Wishlist retrieved successfully", { wishlist });
    } catch (error) {
        next(error);
    }
};

// View wishlist for a specific user
exports.getUserWishlist = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const wishlist = await Wishlist.findOne({ userId }).populate("items.productId", "name price");

        if (!wishlist || wishlist.items.length === 0) {
            return errorResponse(res, "Wishlist is empty", 404);
        }

        return successResponse(res, "User's wishlist retrieved successfully", { wishlist });
    } catch (error) {
        next(error);
    }
};


// Admin viewing any user's wishlist
exports.adminViewUserWishlist = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return errorResponse(res, "Access denied: Admins only", 403);
        }

        const { userId } = req.params;
        const wishlist = await Wishlist.findOne({ userId }).populate("items.productId", "name price");

        if (!wishlist || wishlist.items.length === 0) {
            return errorResponse(res, "Wishlist is empty or does not exist", 404);
        }

        return successResponse(res, "User's wishlist retrieved successfully", { wishlist });
    } catch (error) {
        next(error);
    }
};

// Move item from wishlist to cart (The Complex One)
exports.moveToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { size, color } = req.body;

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) return errorResponse(res, "Wishlist not found", 404);

        const wishIndex = wishlist.items.findIndex(item =>
            item.productId.toString() === productId &&
            item.size === size &&
            item.color === color
        );

        if (wishIndex === -1) return errorResponse(res, "Item not found in wishlist", 404);

        const product = await Product.findById(productId);
        if (!product) return errorResponse(res, "Product no longer exists", 404);

        // STOCK CHECK
        if (product.hasVariants) {
            const variant = product.variants.find(v =>
                v.size === size && v.color === color
            );
            if (!variant || variant.stock < 1)
                return errorResponse(res, "Selected variant out of stock", 400);
        } else {
            if (product.stock < 1)
                return errorResponse(res, "Product out of stock", 400);
        }

        // ADD TO CART
        let cart = await Cart.findOne({ userId });
        if (!cart) cart = new Cart({ userId, items: [] });

        const cartItem = cart.items.find(item =>
            item.productId.toString() === productId &&
            item.size === size &&
            item.color === color
        );

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.items.push({
                productId,
                quantity: 1,
                size,
                color,
                priceAtPurchase: product.price,
                mrpAtPurchase: product.mrp,
                discountAtPurchase: product.discount || 0,
                totalPrice: product.price
            });
        }

        await cart.save();

        wishlist.items.splice(wishIndex, 1);
        wishlist.items.length === 0
            ? await Wishlist.deleteOne({ userId })
            : await wishlist.save();

        return successResponse(res, "Moved to cart", { cart });

    } catch (error) {
        next(error);
    }
};

// Clear Wishlist
exports.clearWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await Wishlist.deleteOne({ userId });

        if (result.deletedCount === 0) {
            return successResponse(res, "Wishlist was already empty");
        }

        return successResponse(res, "Wishlist cleared successfully");
    } catch (error) {
        next(error);
    }
};
