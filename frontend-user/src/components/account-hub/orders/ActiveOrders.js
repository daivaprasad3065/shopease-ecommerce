// frontend-user/src/components/account-hub/orders/ActiveOrders.js

"use client";
import Link from "next/link";
import OrderCard from "./OrderCard";

export default function ActiveOrders({ orders, onOpenCancel, onOpenRequestView }) {
  const activeList = orders.filter(o =>
    ["Pending", "Processing", "Shipped"].includes(o.status)
  );

  return (
    <div className="text-[10px] sm:text-sm leading-tight">

      {/* POLICY BANNER */}
      <div className="bg-blue-50 border border-blue-100 rounded-md p-2.5 sm:p-4 mb-4 sm:mb-6 flex gap-2 sm:gap-3 text-blue-800 items-start">

        <span className="text-[14px] sm:text-xl">ℹ️</span>

        <div>
          <p className="font-bold text-[10px] sm:text-base mb-1">Cancellation Policy</p>

          <ul className="list-disc pl-4 space-y-0.5 sm:space-y-1 text-[9px] sm:text-sm">
            <li>Instant cancel for <strong>Pending</strong> orders.</li>
            <li>Admin approval required for <strong>Processing</strong> orders.</li>
            <li>No cancellation for <strong>Shipped</strong> orders.</li>
          </ul>
        </div>

      </div>

      {/* NO ACTIVE ORDERS */}
      {activeList.length === 0 ? (
        <div className="text-center py-10 sm:py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">

          <p className="text-gray-500 text-[10px] sm:text-sm mb-3 sm:mb-4">
            You have no active orders.
          </p>

          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 text-[10px] sm:text-sm rounded-md font-medium hover:bg-blue-700"
          >
            Start Shopping
          </Link>

        </div>
      ) : (
        activeList.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            showActions={true}
            onOpenCancel={onOpenCancel}
            onOpenRequestView={onOpenRequestView}
          />
        ))
      )}

    </div>
  );
}
