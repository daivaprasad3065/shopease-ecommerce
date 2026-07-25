// frontend-user/src/components/cart/CartItemCard.js

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartItemCard({ item }) {
  const { updateItemQuantity, removeItem, isUpdating } = useCart();

  // Extract product details safely
  const product = item.productId || {};
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'; 

  const handleIncreaseQuantity = () => {
    updateItemQuantity(product._id, item.quantity + 1, item.size, item.color);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateItemQuantity(product._id, item.quantity - 1, item.size, item.color);
    } else {
      removeItem(product._id, item.size, item.color); 
    }
  };

  const handleRemove = () => {
    removeItem(product._id, item.size, item.color);
  };

  if (!product._id) {
    return (
      <div className="border p-3 rounded-md shadow-sm bg-white animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 border p-3 sm:p-4 rounded-md shadow-sm bg-white relative text-[10px] sm:text-base">

      {/* Image */}
      <Link href={'/products/' + product._id} passHref className="flex-shrink-0 self-center sm:self-start">
        <div className="relative w-20 h-20 sm:w-32 sm:h-32 border border-gray-100 rounded-md overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name || 'Product Image'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, 150px"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-grow text-center sm:text-left min-w-0">
        <Link href={'/products/' + product._id} passHref>
            <h3 className="font-semibold text-[12px] sm:text-lg hover:text-blue-600 transition-colors line-clamp-2">
                {product.name || 'Product Name'}
            </h3>
        </Link>

        <p className="text-[10px] sm:text-sm text-gray-500 mb-1 uppercase tracking-wide">
          {product.brand || 'Brand'}
        </p>

        {/* Variants */}
        {(item.size || item.color) && (
            <div className="inline-flex items-center gap-2 text-[9px] sm:text-sm bg-gray-50 px-2 py-1 rounded-md border border-gray-100 mb-2">
                {item.color && (
                    <span className="flex items-center gap-1">
                        <span className="text-gray-600">Color:</span> <span className="font-medium text-black">{item.color}</span>
                    </span>
                )}
                {item.color && item.size && <span className="text-gray-300">|</span>}
                {item.size && (
                     <span className="flex items-center gap-1">
                        <span className="text-gray-600">Size:</span> <span className="font-medium text-black">{item.size}</span>
                     </span>
                )}
            </div>
        )}

        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="font-bold text-sm sm:text-lg text-gray-900">₹{(item.priceAtPurchase || 0).toFixed(2)}</span>
          {item.mrpAtPurchase > item.priceAtPurchase && (
             <span className="text-xs sm:text-sm text-gray-400 line-through">₹{item.mrpAtPurchase}</span>
          )}
          <span className="text-[10px] sm:text-sm font-medium text-green-600 ml-1">
            (Total: ₹{(item.totalPrice || 0).toFixed(2)})
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-2">

        {/* Quantity Controls (compact on mobile) */}
        <div className="flex items-center border border-gray-300 rounded-md bg-white text-[12px]">
          <button
            onClick={handleDecreaseQuantity}
            className="px-2 py-0.5 text-base sm:text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            disabled={isUpdating}
            aria-label="Decrease quantity"
          >
            –
          </button>
          <span className="px-3 py-1 text-sm sm:text-md font-semibold min-w-[28px] text-center">{item.quantity}</span>
          <button
            onClick={handleIncreaseQuantity}
            className="px-2 py-0.5 text-base sm:text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            disabled={isUpdating}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="text-[11px] sm:text-sm font-semibold text-red-500 hover:text-red-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
          disabled={isUpdating}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          <span className="hidden sm:inline">REMOVE</span>
        </button>
      </div>
    </div>
  );
}
