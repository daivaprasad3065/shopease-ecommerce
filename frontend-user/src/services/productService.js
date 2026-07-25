// src/services/productService.js

import apiService from "./apiService";

// GET: Fetch homepage data (featured products, banners, etc.)
export const getHomepageData = async () => {
  try {
    const response = await apiService.get("/products/homepage");
    if (response.data && response.data.success && response.data.data) {
        return response.data.data;
    }
    return response.data; 
  } catch (error) {
    console.error("Homepage fetch error", error);
    return null; 
  }
};

// GET: Fetch product by ID
export const getProductById = async (id) => {
  try {
    const response = await apiService.get(`/products/${id}`);
    return response.data.data || response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch product";
  }
};

// GET: Search products with query parameters
export const searchProducts = async (query) => {
  try {
    const response = await apiService.get(`/products/search${query}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to search products";
  }
};