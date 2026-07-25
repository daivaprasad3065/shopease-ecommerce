// src/services/addressService.js

import apiService from './apiService'; // Your centralized axios instance

// The base URL for all address-related endpoints
const ADDRESS_API_URL = '/users/addresses'; // e.g., http://localhost:5000/api/users/addresses

// GET: Fetch all addresses for the logged-in user
export const getAddresses = async () => {
  try {
    const response = await apiService.get(ADDRESS_API_URL);
    return response.data; 
  } catch (error) {
    console.error('Error fetching addresses:', error.response?.data || error.message);
    throw error;
  }
};

// POST: Add a new address
export const addAddress = async (addressData) => {
  try {
    const response = await apiService.post(ADDRESS_API_URL, addressData);
    return response.data;
  } catch (error) {
    console.error('Error adding address:', error.response?.data || error.message);
    throw error;
  }
};

// PUT: Update an existing address
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await apiService.put(`${ADDRESS_API_URL}/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error.response?.data || error.message);
    throw error;
  }
};

// DELETE: Remove an address
export const deleteAddress = async (addressId) => {
  try {
    const response = await apiService.delete(`${ADDRESS_API_URL}/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting address:', error.response?.data || error.message);
    throw error;
  }
};