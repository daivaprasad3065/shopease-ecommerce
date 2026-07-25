"use client";

import Link from "next/link";

export default function QuickLinks() {
  return (
    <div className="bg-white rounded shadow p-6 h-f ull">
      <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
      <ul className="space-y-3">
        <li>
          <Link href="/account?view=info" className="text-blue-600 hover:underline font-medium">
            Edit Profile
          </Link>
        </li>
        <li>
          <Link href="/account?view=orders" className="text-blue-600 hover:underline font-medium">
            View Orders
          </Link>
        </li>
        <li>
          <Link href="/wishlist" className="text-blue-600 hover:underline font-medium">
            Wishlist
          </Link>
        </li>
      </ul>
    </div>
  );
}
