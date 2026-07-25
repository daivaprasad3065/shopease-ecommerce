// frontend-user/src/components/account-hub/orders/PastOrders.js

"use client";
import Link from "next/link";
import OrderCard from "./OrderCard";

export default function PastOrders({ orders }) {
  const pastList = orders.filter(o =>
    ["Delivered", "Cancelled"].includes(o.status)
  );

  if (pastList.length === 0) {
    return (
      <div className="text-center py-14 sm:py-20 text-gray-500 text-[10px] sm:text-sm">
        <p>No past orders found.</p>
      </div>
    );
  }

  return (
    <div className="text-[10px] sm:text-sm leading-tight">
      {pastList.map(order => (
        <OrderCard
          key={order._id}
          order={order}
          showActions={false}
        />
      ))}
    </div>
  );
}
