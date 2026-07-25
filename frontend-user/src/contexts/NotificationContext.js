// frontend-user/src/contexts/NotificationContext.js

"use client";
import { createContext, useContext, useState } from "react";
import { getUnreadCount, getNotifications } from "@/services/notificationService";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const refreshUnread = async () => {
    try {
      const res = await getUnreadCount();
      setUnread(res.count || 0);
    } catch (err) {
      console.error("Unread fetch failed:", err);
    }
  };

  const refreshNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error("Notification load failed:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ unread, notifications, refreshUnread, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
