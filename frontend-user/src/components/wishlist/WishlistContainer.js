// frontend-user/src/components/wishlist/WishlistContainer.js

"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import WishlistItemCard from "./WishlistItemCard";
import Link from "next/link";
import { useEffect } from "react";

export default function WishlistContainer() {
  const { wishlist, reload, loading, clear } = useWishlist();

  useEffect(() => {
    reload();
  }, []);

  if (loading)
    return (
      <div className="py-16 text-center text-gray-500 text-[12px] sm:text-base">
        Loading wishlist...
      </div>
    );

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-lg sm:text-2xl font-bold mb-1">Your Wishlist is Empty</h1>
        <p className="text-gray-500 text-[12px] sm:text-sm mb-3">
          Save items to view them later.
        </p>
        <Link
          href="/products"
          className="text-blue-600 font-semibold underline text-[12px] sm:text-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="px-[6px] sm:px-4 py-4 sm:py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-base sm:text-2xl font-bold">My Wishlist</h1>

        <button
          onClick={clear}
          className="text-[11px] sm:text-sm text-red-600 hover:underline"
        >
          Clear Wishlist
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        {wishlist.map((item, index) => (
          <WishlistItemCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
