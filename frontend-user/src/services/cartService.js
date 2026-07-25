// src/services/cartService.js

import apiService from './apiService'; 

const CART_API_URL = '/cart'; 

// POST: Add an item to the cart (Now supports Size & Color)
export const addItemToCart = async (productId, quantity, size = null, color = null) => {
  try {
    // Send variants in the body
    const response = await apiService.post(`${CART_API_URL}/add`, { 
      productId, 
      quantity, 
      size, 
      color 
    });
    return response.data; 
  } catch (error) {
    console.error('Error adding item to cart:', error.response?.data || error.message);
    throw error;
  }
};

// PATCH: Update item quantity (Need Size/Color to identify specific variant)
export const updateCartItemQuantity = async (productId, quantity, size = null, color = null) => {
  try {
    const response = await apiService.patch(`${CART_API_URL}/update/${productId}`, { 
      quantity,
      size,
      color
    });
    return response.data; 
  } catch (error) {
    console.error('Error updating cart item:', error.response?.data || error.message);
    throw error;
  }
};

// DELETE: Remove an item (Need Size/Color to identify specific variant)
export const removeItemFromCart = async (productId, size = null, color = null) => {
  try {
    const response = await apiService.delete(`${CART_API_URL}/remove/${productId}`, {
      data: { size, color } 
    });
    return response.data; 
  } catch (error) {
    console.error('Error removing item from cart:', error.response?.data || error.message);
    throw error;
  }
};

// GET: Fetch cart
export const getCart = async () => {
  try {
    const response = await apiService.get(CART_API_URL);
    return response.data; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { success: true, cart: { items: [], totalAmount: 0 } }; 
    }
    console.error('Error fetching cart:', error.response?.data || error.message);
    throw error;
  }
};