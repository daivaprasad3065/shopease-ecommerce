// frontend-user/src/services/orderService.js

import apiService from './apiService';

// POST: Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await apiService.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET: Get My Orders (Supports Pagination & Filtering)
export const getMyOrders = async (page = 1, limit = 10, filters = {}) => {
  try {
    // Start with base pagination
    let url = `/orders?page=${page}&limit=${limit}`;
    
    // Append filters if they exist
    if (filters.year) url += `&year=${filters.year}`;
    if (filters.month) url += `&month=${filters.month}`;

    const response = await apiService.get(url);
    return response.data; 
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET: Get Order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await apiService.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// DELETE: Cancel an order (if status is Pending)
export const cancelOrder = async (orderId) => {
  try {
    const response = await apiService.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// POST: Request order cancellation (for non-pending orders)
export const requestCancelOrder = async (orderId, reason) => {
  try {
    const response = await apiService.post(`/orders/request-cancel/${orderId}`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};