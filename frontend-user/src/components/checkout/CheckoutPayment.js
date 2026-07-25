// src/components/checkout/CheckoutPayment.js

"use client";

import { useState } from 'react';

export default function CheckoutPayment({ activeStep, onConfirmOrder, isPlacingOrder }) {
  const isOpen = activeStep === 3;
  const [selectedMethod, setSelectedMethod] = useState('cod');

  const handleDummyClick = (name) => {
    alert(`${name} is currently unavailable. We are integrating secure online payments very soon! Please confirm with Cash on Delivery.`);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <h2 className={`text-lg font-semibold flex items-center gap-2 ${isOpen ? 'text-blue-600' : 'text-gray-500'}`}>
        <span className="flex items-center justify-center w-6 h-6 text-xs bg-gray-200 text-gray-600 rounded-sm">3</span>
        Payment Options
      </h2>

      {isOpen && (
        <div className="mt-4 pl-0 sm:pl-8 space-y-3">

          {/* --- TRUST MESSAGE --- */}
          <div className="bg-blue-50 p-3 rounded border border-blue-100 mb-4">
            <p className="text-sm text-blue-800">
              <span className="font-bold">Note:</span> To build trust and ensure your satisfaction, we encourage you to proceed with <strong>Cash on Delivery</strong>. Pay only when you receive your item!
            </p>
          </div>

          {/* Dummy Options */}
          {['UPI', 'Wallets', 'Credit / Debit / ATM Card', 'Net Banking'].map((method) => (
            <label 
                key={method} 
                className="flex items-center gap-3 p-4 border rounded cursor-not-allowed opacity-60 bg-gray-50" 
                onClick={() => handleDummyClick(method)}
            >
              <input type="radio" disabled name="payment" className="accent-blue-600" />
              <span className="text-gray-700">{method} <span className="text-xs text-orange-500 font-medium ml-2">Coming Soon</span></span>
            </label>
          ))}

          {/* Real Option */}
          <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-blue-50 border-blue-500">
            <input 
              type="radio" 
              name="payment" 
              checked={selectedMethod === 'cod'} 
              onChange={() => setSelectedMethod('cod')}
              className="accent-blue-600" 
            />
            <span className="font-bold text-gray-800">Cash on Delivery</span>
          </label>

          <div className="mb-4 text-xs text-gray-500 bg-gray-50 p-2 rounded border">
            By placing this order, you agree that cancellations are only instant while the order status is <b>Pending</b>. Once processing, cancellations require approval.
          </div>

          <div className="flex justify-end mt-4">
            <button 
                onClick={onConfirmOrder}
                disabled={isPlacingOrder}
                className="bg-orange-500 text-white px-10 py-3 rounded-sm text-sm font-bold hover:bg-orange-600 shadow-sm uppercase w-full sm:w-auto disabled:opacity-70"
            >
                {isPlacingOrder ? 'Confirming Order...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}