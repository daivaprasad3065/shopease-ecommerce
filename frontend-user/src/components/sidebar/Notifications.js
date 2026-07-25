"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";

export default function SidebarNotifications() {
  const { notifications, unread, refreshNotifications } = useNotifications();

  // Load notifications on sidebar open / mount
  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Take only the latest 3 notifications
  const latest = notifications.slice(0, 3);

  return (
    <div className="bg-white rounded shadow p-4 mt-6 border border-gray-200">
      <h2 className="text-lg font-semibold mb-3 flex justify-between items-center">
        Notifications
        {unread > 0 && (
          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
            {unread}
          </span>
        )}
      </h2>

      {/* Empty state */}
      {latest.length === 0 && (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      )}

      {/* Notification preview list */}
      <div className="space-y-3">
        {latest.map((note) => (
          <div
            key={note._id}
            className={`p-3 rounded border text-sm cursor-pointer transition ${
              note.read
                ? "bg-gray-50 border-gray-200"
                : "bg-blue-50 border-blue-300"
            }`}
          >
            <p className="font-medium text-gray-800">{note.title}</p>
            <p className="text-gray-600 text-xs truncate">{note.message}</p>

            <div className="text-[10px] text-gray-400 mt-1">
              {new Date(note.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <Link
        href="/account?view=notifications"
        className="block mt-4 text-sm text-blue-600 hover:underline text-right"
      >
        View All →
      </Link>
    </div>
  );
}
