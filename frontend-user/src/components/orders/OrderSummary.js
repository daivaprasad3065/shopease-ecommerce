// frontend-user/src/components/orders/OrderSummary.js

"use client";
import Link from "next/link";

export default function OrderSummary({ order, onCancelClick }) {
  
  return (
    <div className="space-y-6">
      
      {/* 1. Price Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
        <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span>{order.paymentMethod}</span>
          </div>
        </div>
        <div className="flex justify-between font-bold text-lg text-gray-900 pt-4">
          <span>Total</span>
          <span>₹{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* 2. Shipping Address */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
        <div className="text-sm text-gray-600 leading-relaxed">
          {order.deliveryAddress ? (
            <>
              <p className="font-medium text-gray-900 mb-1">{order.user?.name}</p>
              <p>{order.deliveryAddress.line1}</p>
              {order.deliveryAddress.line2 && <p>{order.deliveryAddress.line2}</p>}
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
              <p className="mt-3 text-gray-900 font-medium flex items-center gap-2">
                  <span>📞</span> {order.deliveryAddress.phone}
              </p>
            </>
          ) : (
            <p className="text-red-500">Address info unavailable</p>
          )}
        </div>
      </div>

      {/* 3. Need Help Section (Always visible) */}
      <div className="print:hidden">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Need help with this order?</h3>
            
            {/* Cancellation Logic (Hidden if Delivered/Cancelled) */}
            {order.status !== "Cancelled" && order.status !== "Delivered" && (
                <>
                    {order.cancellationRequest ? (
                        <div className={`p-3 rounded-md text-sm border ${
                            order.cancellationRequest.status === 'Pending' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                            order.cancellationRequest.status === 'Approved' ? 'bg-green-50 border-green-200 text-green-700' :
                            'bg-red-50 border-red-200 text-red-700'
                        }`}>
                            <strong>Cancellation {order.cancellationRequest.status}</strong>
                            <p className="mt-1 text-xs">Reason: {order.cancellationRequest.reason}</p>
                        </div>
                    ) : (
                        <button 
                            onClick={onCancelClick}
                            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all mb-2"
                        >
                            {order.status === "Pending" ? "Cancel Order" : "Request Cancellation"}
                        </button>
                    )}
                </>
            )}

            {/* Customer Care Button (Always Visible) */}
            <Link 
                href="/account?view=support"
                className="w-full py-3 border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 text-center block transition-all"
            >
                Contact Customer Care
            </Link>
        </div>
      </div>

    </div>
  );
}