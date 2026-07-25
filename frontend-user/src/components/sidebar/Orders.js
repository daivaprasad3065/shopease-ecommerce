// frontend-user/src/components/sidebar/Orders.js

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyOrders } from "@/services/orderService"; 

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await getMyOrders();
        // Extract orders safely
        setOrders(response.data?.orders || []); 
      } catch (error) {
        console.error("Failed to load sidebar orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      
      {loading ? (
        <div className="text-sm text-gray-500 py-2">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-sm text-gray-500 py-2">No orders yet.</div>
      ) : (
        <ul className="flex flex-col">
          {/* Show only the latest 3 orders */}
          {orders.slice(0, 3).map((order) => (
            <li key={order._id} className="border-b last:border-b-0">
              
              {/* --- CLICKABLE AREA --- */}
              <Link 
                href={`/orders/${order._id}`} 
                className="block py-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-blue-600 text-sm group-hover:underline">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-gray-700">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </Link>

            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 pt-2 border-t">
        <Link href="/account?view=orders" className="text-blue-600 hover:underline text-sm font-semibold block text-center">
          View all orders
        </Link>
      </div>
    </div>
  );
}