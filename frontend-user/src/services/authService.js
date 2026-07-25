// frontend-user/src/services/authService.js

import apiService from './apiService';

// POST: Register a new user
export const registerUser = async (userData) => {
  try {
    // userData = { name, identifier, password }
    const response = await apiService.post('/users/register', userData);
    return response.data; // Returns { success, message, data: { token, user } }
  } catch (error) {
    throw error; 
  }
};

// POST: Login a user
export const loginUser = async (credentials) => {
  try {
    // credentials = { identifier, password }
    const response = await apiService.post('/users/login', credentials);
    return response.data; // Returns { success, message, data: { token, user } }
  } catch (error) {
    throw error;
  }
};