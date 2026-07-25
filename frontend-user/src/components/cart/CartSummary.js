// src/components/cart/CartSummary.js

"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartSummary() {
  const { totalAmount, totalMRP, totalAdditionalDiscount, cartItemCount } =
    useCart();

  const effectiveMRP = totalMRP || totalAmount;
  const totalSellingPrice = totalAmount + totalAdditionalDiscount;

  const baseDiscount = effectiveMRP - totalSellingPrice;

  const WAIVED_DELIVERY_FEE = 40;
  const WAIVED_PLATFORM_FEE = 20;

  const totalSavings =
    baseDiscount +
    totalAdditionalDiscount +
    WAIVED_DELIVERY_FEE +
    WAIVED_PLATFORM_FEE;

  return (
    <div className="p-3 sm:p-4 bg-white rounded-lg shadow-md border text-[11px] sm:text-base">

      <h3 className="font-bold text-gray-500 uppercase text-xs sm:text-sm mb-3 border-b pb-2">
        Price Details
      </h3>

      <div className="space-y-2 sm:space-y-3 mb-4 text-gray-800">

        <div className="flex justify-between">
          <span>Price ({cartItemCount} items)</span>
          <span>₹{effectiveMRP.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>- ₹{baseDiscount.toFixed(2)}</span>
        </div>

        {totalAdditionalDiscount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Additional Discount</span>
            <span>- ₹{totalAdditionalDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Platform Fee</span>
          <div>
            <span className="line-through text-gray-400 mr-1">₹20</span>
            <span className="text-green-600">Free</span>
          </div>
        </div>

        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <div>
            <span className="line-through text-gray-400 mr-1">₹40</span>
            <span className="text-green-600">Free</span>
          </div>
        </div>

      </div>

      {/* TOTAL */}
      <div className="border-t pt-3 sm:pt-4">
        <div className="flex justify-between font-bold text-base sm:text-lg mb-3">
          <span>Total Amount</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>

        {totalSavings > 0 && (
          <div className="mb-3 text-center text-[10px] sm:text-sm text-green-700 font-semibold bg-green-50 p-2 rounded">
            You will save ₹{totalSavings.toFixed(2)} on this order!
          </div>
        )}

        <Link href="/checkout">
          <button className="w-full bg-blue-600 text-white font-bold py-2 sm:py-3 rounded-md hover:bg-blue-700 transition">
            Place Order
          </button>
        </Link>
      </div>
    </div>
  );
}
