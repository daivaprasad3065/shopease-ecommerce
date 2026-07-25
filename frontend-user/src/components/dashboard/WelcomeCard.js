// frontend-user/src/components/dashboard/WelcomeCard.js
"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function WelcomeCard() {
  const { user, isLoggedIn, isFirstLogin } = useAuth();

  const displayName =
    user?.name ||
    user?.firstName ||
    user?.email?.split("@")[0] ||
    "User";

  const message = !isLoggedIn
    ? "Welcome!"
    : isFirstLogin
    ? `Welcome to Satya's Fashion Book, ${displayName}!`
    : `Welcome back, ${displayName}!`;

  return (
    <div className="bg-blue-100 text-blue-900 rounded-lg p-4 sm:p-6 mb-4 shadow">
      <h2 className="text-xl sm:text-2xl font-semibold mb-2 break-words">
        {message}
      </h2>

      <p className="text-blue-800 text-sm sm:text-base">
        {isFirstLogin
          ? "Glad to have you here. Explore our latest collections!"
          : "Here’s your personalized dashboard overview."}
      </p>
    </div>
  );
}
