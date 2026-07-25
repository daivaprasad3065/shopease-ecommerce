// frontend-user/src/services/wishlistService.js

import apiService from "./apiService";

// POST: Add to Wishlist
export const addToWishlistService = async (productId, size, color) => {
  return apiService.post("/wishlist/add", { productId, size, color }).then(res => res.data.data);
};

// DELETE: Remove from Wishlist
export const removeFromWishlistService = async (productId, size, color) => {
  return apiService.delete(`/wishlist/remove/${productId}`, {
    data: { size, color }
  }).then(res => res.data.data);
};

// GET: Get Wishlist
export const getWishlistService = async () => {
  return apiService.get("/wishlist").then(res => res.data.data);
};

// DELETE: Clear Wishlist
export const clearWishlistService = async () => {
  return apiService.delete("/wishlist/clear").then(res => res.data.data);
};

// POST: Move item from Wishlist to Cart
export const moveToCart = async (productId, size, color) => {
  try {
    const res = await apiService.post(`/wishlist/move-to-cart/${productId}`, {
      size,
      color,
    });
    return res.data;
  } catch (err) {
    const payload = err?.response?.data || { message: err.message || "Unknown error" };
    const e = new Error(payload.message || "Move to cart failed");
    e.payload = payload;
    throw e;
  }
};