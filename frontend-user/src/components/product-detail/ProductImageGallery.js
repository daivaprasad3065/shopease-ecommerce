// frontend-user/src/components/product-detail/ProductImageGallery.js

"use client";

import { useState } from "react";
import Image from "next/image";
import { useWishlist } from "@/contexts/WishlistContext";
import toast from "react-hot-toast";

const placeholderImage =
  "https://thumbs.dreamstime.com/b/red-sign-isolated-white-reads-sorry-technical-difficulties-problem-failure-concept-device-system-error-site-maintenance-page-367474695.jpg";

export default function ProductImageGallery({ images, productId }) {
  const safeImages = images?.length > 0 ? images : [placeholderImage];
  const [selectedImage, setSelectedImage] = useState(safeImages[0]);

  const { wishlist, add, remove } = useWishlist();

  const isWishlisted = wishlist?.some(
    (item) => item.productId?._id === productId
  );

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await remove(productId);
        toast("Removed from wishlist ❤️‍🩹");
      } else {
        await add(productId);
        toast("Added to wishlist ❤️");
      }
    } catch (err) {
      toast.error("Wishlist update failed");
    }
  };

  return (
    <div className="w-full">
      {/* MAIN IMAGE */}
      <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">

        {/* ❤️ WISHLIST ICON */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-3 rounded-full shadow-lg transition 
            ${isWishlisted ? "bg-red-100" : "bg-white/90"}
          `}
        >
          {isWishlisted ? (
            <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32..." />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 ..." />
            </svg>
          )}
        </button>

        <Image
          src={selectedImage}
          alt="Product image"
          fill
          className="object-cover"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex space-x-2 mt-4 overflow-x-auto p-2">
        {safeImages.map((img, i) => (
          <div
            key={i}
            className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer
              ${selectedImage === img ? "ring-2 ring-blue-600 ring-offset-2" : ""}
            `}
            onClick={() => setSelectedImage(img)}
          >
            <Image src={img} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
