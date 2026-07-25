// frontend-user/src/components/cart/CartContainer.js

"use client";

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import CartItemCard from './CartItemCard';
import CartSummary from './CartSummary';

export default function CartContainer() {
  const { cartItems, totalAmount, cartItemCount, isLoading } = useCart();

  // 1. Loading State
  if (isLoading) {
    return (
      <p className="text-center py-20 text-[12px]">
        Loading your cart...
      </p>
    );
  }

  // 2. Empty State
  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-10 text-center">
        <h1 className="text-lg sm:text-3xl font-bold mb-3">Your Cart is Empty</h1>
        <p className="mb-6 text-gray-600 text-[12px]">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 inline-block text-[12px]"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // 3. Main Content
  return (
    <div
      className="
        container mx-auto 
        px-2 sm:px-4 lg:px-8 
        py-8 sm:py-12 

        /* MOBILE RECTANGULAR WRAPPER */
        bg-white sm:bg-transparent 
        border border-gray-200 sm:border-0 
        rounded-xl sm:rounded-none 
        shadow-sm sm:shadow-none
      "
    >
      <h1 className="text-[14px] sm:text-3xl font-bold mb-6 sm:mb-8">
        Shopping Cart
      </h1>

      {/* FLEX LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">

        {/* Column 1: Cart Items */}
        <div className="w-full lg:w-2/3 space-y-3 sm:space-y-4">
          {cartItems.map((item) => (
            <CartItemCard
              key={item.productId?._id || item._id}
              item={item}
            />
          ))}
        </div>

        {/* Column 2: Cart Summary */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24 self-start">
          <CartSummary totalAmount={totalAmount} itemCount={cartItemCount} />
        </div>
      </div>
    </div>
  );
}
