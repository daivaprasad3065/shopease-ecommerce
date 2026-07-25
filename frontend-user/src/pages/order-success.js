// frontend-user/src/pages/order-success.js

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';

export default function OrderSuccessPage() {
  const router = useRouter();
  const { loadCart } = useCart();
  
  const { orderId } = router.query; 

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-lg border border-gray-100 animate-fadeIn">
          
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <svg className="h-12 w-12 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h2>
            <p className="mt-4 text-sm text-gray-600">
              Thank you for shopping with <strong>Satya&apos;s Fashion Book</strong>.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Your order has been received and will be processed shortly. You can pay cash upon delivery.
            </p>
            
            {orderId && (
                <p className="mt-4 text-xs font-mono bg-gray-100 inline-block px-2 py-1 rounded text-gray-600">
                    Order ID: #{orderId}
                </p>
            )}
          </div>

          <div className="flex flex-col space-y-4 pt-4">
            {/* LINK TO THE DEDICATED ORDER DETAILS PAGE */}
            <Link 
              href={orderId ? `/orders/${orderId}` : "/account?view=orders"} 
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors"
            >
              View Order Details
            </Link>
            
            <Link 
              href="/products" 
              className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}