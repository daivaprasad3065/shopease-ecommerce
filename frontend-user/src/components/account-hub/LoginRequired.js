// frontend-user/src/components/account-hub/Privacy.js

"use client";

import Link from "next/link";

export default function LoginRequired({ title = "This section requires login" }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-dashed border-gray-300
                    text-center animate-fadeIn">

      <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>

      <p className="text-[11px] sm:text-sm text-gray-600 mb-4">
        Please login or create an account to continue.
      </p>

      <div className="flex justify-center gap-3">
        <Link
          href="/auth/login"
          className="px-4 py-1.5 text-[11px] sm:text-sm bg-blue-600 text-white
                     rounded-md hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          href="/auth/register"
          className="px-4 py-1.5 text-[11px] sm:text-sm border border-blue-600
                     text-blue-600 rounded-md hover:bg-blue-50"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
