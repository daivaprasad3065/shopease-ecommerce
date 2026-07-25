// frontend-user/src/services/notificationService.js
import apiService from "./apiService";

const unwrap = (axiosResponse) => {
  if (!axiosResponse || !axiosResponse.data) return null;
  return axiosResponse.data.data ?? axiosResponse.data;
};

// GET: Fetch paginated notifications
export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const res = await apiService.get(`/notifications?page=${page}&limit=${limit}`);
    return unwrap(res); // => { notifications, total, page, totalPages }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// PUT: Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    const res = await apiService.put(`/notifications/mark-read`);
    return unwrap(res); 
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// PUT: Mark a single notification as read
export const markNotificationAsRead = async (id) => {
  try {
    const res = await apiService.put(`/notifications/${id}/mark-read`);
    return unwrap(res);
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET: Get count of unread notifications
export const getUnreadCount = async () => {
  try {
    const res = await apiService.get(`/notifications/unread-count`);
    return res.data?.data ?? res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
