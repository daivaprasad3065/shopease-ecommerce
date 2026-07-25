// frontend-user/src/components/wishlist/WishlistItemCard.js

"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";

export default function WishlistItemCard({ item }) {
  const product = item.productId;
  const { remove, move } = useWishlist();
  const { reload: reloadCart } = useCart();

  if (!product) return null;

  const handleRemove = async () => {
    await remove(product._id, item.size, item.color);
    toast("Removed from wishlist ❌");
  };

  const handleMoveToCart = async () => {
    try {
      const res = await move(product._id, item.size, item.color);
      await reloadCart();
      toast.success(res?.message || "Moved to cart");
    } catch (err) {
      toast.error("Unable to move to cart");
    }
  };

  return (
    <div className="flex gap-3 sm:gap-4 border p-3 sm:p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">

      {/* PRODUCT IMAGE */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex-shrink-0 rounded-md overflow-hidden border">
        <Image
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 96px"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-1 min-w-0">

        {/* NAME */}
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-[12px] sm:text-lg text-gray-800 hover:text-blue-600 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* VARIANTS */}
        {(item.size || item.color) && (
          <p className="text-[10px] sm:text-sm text-gray-600 mt-1">
            {item.color && <>Color: {item.color} </>}
            {item.size && <>Size: {item.size}</>}
          </p>
        )}

        {/* PRICE */}
        <p className="font-bold text-[12px] sm:text-lg mt-1 text-gray-900">
          ₹{product.price}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 sm:gap-4 mt-3 sm:mt-4">

          <button
            onClick={handleMoveToCart}
            className="px-2 sm:px-3 py-1 bg-blue-600 text-white text-[10px] sm:text-sm rounded hover:bg-blue-700 transition"
          >
            Move to Cart
          </button>

          <button
            onClick={handleRemove}
            className="px-2 sm:px-3 py-1 text-[10px] sm:text-sm text-red-600 hover:underline"
          >
            Remove
          </button>

        </div>
      </div>

    </div>
  );
}
