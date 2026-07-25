// frontend-user/src/components/account-hub/Notifications.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  getNotifications,
  markAllAsRead,
  markNotificationAsRead,
} from "@/services/notificationService";
import toast from "react-hot-toast";

export default function Notifications() {
  const { refreshUnread } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMarking, setIsMarking] = useState(false);

  const fetchNotifications = async (p = 1) => {
    try {
      setLoading(true);
      const res = await getNotifications(p, 20);
      setNotifications(res.notifications || []);
      setPage(res.page || 1);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
    // eslint-disable-next-line
  }, []);

  const markAll = async () => {
    try {
      setIsMarking(true);
      await markAllAsRead();
      refreshUnread();
      await fetchNotifications(page);
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark as read");
    } finally {
      setIsMarking(false);
    }
  };

  const markSingle = async (id) => {
    try {
      await markNotificationAsRead(id);
      refreshUnread();
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n
        )
      );
    } catch (err) {
      toast.error("Failed to mark notification");
    }
  };

  /* ------------------ LOADING ------------------ */

  if (loading) {
    return (
      <div className="p-6 sm:p-8 text-center text-gray-500 text-[10px] sm:text-sm animate-pulse">
        Loading notifications...
      </div>
    );
  }

  /* ------------------ UI ------------------ */

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 text-[10px] sm:text-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-[12px] sm:text-lg md:text-xl font-bold text-gray-800">
          Notifications
        </h2>

        {notifications.length > 0 && (
          <button
            onClick={markAll}
            disabled={isMarking}
            className="text-[10px] sm:text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
          >
            {isMarking ? "Marking..." : "Mark all as read"}
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-[10px] sm:text-sm">
          No notifications yet.
        </div>
      ) : (

        /* NOTIFICATION LIST */
        <div className="space-y-3">
          {notifications.map((note) => (
            <div
              key={note._id}
              className={`p-3 sm:p-4 rounded border flex flex-col sm:flex-row justify-between gap-3 transition
                ${
                  note.read
                    ? "bg-gray-50 border-gray-100"
                    : "bg-blue-50 border-blue-200"
                }`}
            >
              
              {/* LEFT SECTION */}
              <div className="flex-1 min-w-0">
                
                {/* TITLE + TIMESTAMP */}
                <div className="flex justify-between items-start gap-2">

                  {/* TITLE */}
                  <div className="flex-1 min-w-0">
                    {note.type === "order" && note.orderId ? (
                      <Link
                        href={`/orders/${note.orderId}`}
                        className="font-semibold text-blue-700 hover:underline text-[11px] sm:text-base line-clamp-1"
                      >
                        {note.title}
                      </Link>
                    ) : (
                      <div className="font-semibold text-gray-800 text-[11px] sm:text-base line-clamp-1">
                        {note.title}
                      </div>
                    )}

                    {/* MESSAGE */}
                    <div className="mt-1 text-gray-600 text-[9px] sm:text-sm leading-snug">
                      {note.message}
                    </div>
                  </div>

                  {/* TIMESTAMP + BADGE */}
                  <div className="text-right shrink-0">
                    <div className="text-[8px] sm:text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </div>

                    {!note.read && (
                      <div className="mt-1 text-[8px] sm:text-xs inline-block px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-semibold">
                        New
                      </div>
                    )}
                  </div>
                </div>

                {/* VIEW ORDER / LINK */}
                {(note.link || (note.type === "order" && note.orderId)) && (
                  <div className="mt-2">
                    {note.type === "order" && note.orderId ? (
                      <Link
                        href={`/orders/${note.orderId}`}
                        className="text-[10px] sm:text-sm text-blue-600 underline font-medium"
                      >
                        View Order Details →
                      </Link>
                    ) : (
                      <a
                        href={note.link}
                        className="text-[10px] sm:text-sm text-blue-600 underline"
                      >
                        Open Link
                      </a>
                    )}
                  </div>
                )}

              </div>


              {/* RIGHT SECTION - MARK READ BUTTON */}
              {!note.read && (
                <div className="flex sm:flex-col items-end sm:items-center">
                  <button
                    onClick={() => markSingle(note._id)}
                    className="text-[9px] sm:text-xs px-2 py-1 rounded bg-white border border-gray-200 hover:bg-gray-50 whitespace-nowrap"
                  >
                    Mark read
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-[10px] sm:text-sm text-gray-600">

          <div>
            Page {page} of {totalPages}
          </div>

          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => {
                const p = Math.max(1, page - 1);
                setPage(p);
                fetchNotifications(p);
              }}
              className="px-3 py-1 rounded border disabled:opacity-50 text-[10px] sm:text-sm"
            >
              Prev
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => {
                const p = Math.min(totalPages, page + 1);
                setPage(p);
                fetchNotifications(p);
              }}
              className="px-3 py-1 rounded border disabled:opacity-50 text-[10px] sm:text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
