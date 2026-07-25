// frontend-user/src/components/checkout/CheckoutPriceDetails.js

"use client";

import { useCart } from "@/contexts/CartContext";

export default function CheckoutPriceDetails({ 
  totalAmount: propTotal, 
  itemCount: propCount,
  totalMRP: propMRP,              
  additionalDiscount: propDiscount
}) {
  const { 
    totalAmount: ctxTotal, 
    totalMRP: ctxMRP, 
    totalAdditionalDiscount: ctxDiscount, 
    cartItemCount: ctxCount 
  } = useCart();

  const isBuyNowMode = propTotal !== undefined;

  const totalAmount = isBuyNowMode ? propTotal : ctxTotal;
  const cartItemCount = propCount !== undefined ? propCount : ctxCount;

  // CALCULATING MRP (The High Price)
  // If in Buy Now mode, then use prop. If prop is 0/undefined, fallback to totalAmount (no discount shown).
  const effectiveMRP = isBuyNowMode 
    ? (propMRP > 0 ? propMRP : totalAmount) 
    : (ctxMRP > 0 ? ctxMRP : ctxTotal);

  const totalAdditionalDiscount = isBuyNowMode 
    ? (propDiscount || 0) 
    : ctxDiscount;

  // CALCULATING SAVINGS
  const totalSellingPrice = totalAmount + totalAdditionalDiscount;
  
  // "Base Discount" is the difference between MRP and Selling Price (The crossed-out part)
  const baseDiscount = effectiveMRP - totalSellingPrice;

  // Fixed Fees that are waived
  const WAIVED_DELIVERY_FEE = 40;
  const WAIVED_PLATFORM_FEE = 20;

  // Grand Total Savings
  const totalSavings = baseDiscount + totalAdditionalDiscount + WAIVED_DELIVERY_FEE + WAIVED_PLATFORM_FEE;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-24">
      
      {/* HEADER */}
      <h3 className="font-bold text-gray-500 uppercase text-xs sm:text-sm mb-4 border-b pb-2 tracking-wide">
        Price Details
      </h3>
      
      <div className="space-y-3 text-sm mb-4 text-gray-800">
        
        {/* ROW 1: TOTAL MRP (High Price) */}
        <div className="flex justify-between">
          <span>Price ({cartItemCount} items)</span>
          <span className="font-medium">₹{effectiveMRP.toFixed(2)}</span>
        </div>
        
        {/* ROW 2: BASE DISCOUNT */}
        {baseDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- ₹{baseDiscount.toFixed(2)}</span>
          </div>
        )}

        {/* ROW 3: ADDITIONAL DISCOUNT (Coupons/Bulk) */}
        {totalAdditionalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Additional Discount</span>
            <span>- ₹{totalAdditionalDiscount.toFixed(2)}</span>
          </div>
        )}
        
        {/* ROW 4: PLATFORM FEE */}
        <div className="flex justify-between items-center">
           <span>Platform Fee</span>
           <div>
             <span className="line-through text-gray-400 mr-2 text-xs">₹{WAIVED_PLATFORM_FEE}</span>
             <span className="text-green-600 font-medium">Free</span>
           </div>
        </div>

        {/* ROW 5: DELIVERY FEE */}
        <div className="flex justify-between items-center">
          <span>Delivery Charges</span>
          <div>
             <span className="line-through text-gray-400 mr-2 text-xs">₹{WAIVED_DELIVERY_FEE}</span>
             <span className="text-green-600 font-medium">Free</span>
          </div>
        </div>
      </div>
      
      {/* FINAL TOTAL */}
      <div className="border-t pt-4 border-dashed border-gray-300">
        <div className="flex justify-between font-bold text-lg text-gray-900">
          <span>Total Payable</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
      {/* SAVINGS HIGHLIGHT (The "Feel Good" part) */}
      {totalSavings > 0 && (
        <div className="mt-4 text-sm text-green-700 font-bold bg-green-50 p-2 rounded-md border border-green-200 text-center">
          Yay! You will save ₹{totalSavings.toFixed(2)} on this order!
        </div>
      )}
      
      <div className="mt-3 text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 justify-center">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Safe and Secure Payments. 100% Authentic.
      </div>
    </div>
  );
}