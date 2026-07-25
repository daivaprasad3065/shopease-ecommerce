"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import { getOrderById, cancelOrder, requestCancelOrder } from "@/services/orderService";

import OrderTracker from "@/components/orders/OrderTracker";
import OrderItemsList from "@/components/orders/OrderItemsList";
import OrderSummary from "@/components/orders/OrderSummary";

export default function OrderDetailsPage() {
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Cancellation Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    if (!router.isReady) return;
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data.data.order);
      } catch (err) {
        toast.error("Order not found.");
        router.push("/account?view=orders"); 
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [router.isReady, orderId, router]);

  // 2. Invoice Handler
  const handleDownloadInvoice = () => {
    if (order) window.print();
  };

  // 3. Cancel Logic
  const handleCancelSubmit = async () => {
    if (!order) return;
    setIsSubmitting(true);
    try {
        if (order.status === "Pending") {
            await cancelOrder(order._id);
            toast.success("Order cancelled successfully");
        } else {
            if (!cancelReason.trim()) throw "Please give a reason";
            await requestCancelOrder(order._id, cancelReason);
            toast.success("Request submitted to Admin.");
        }
        setIsModalOpen(false);
        // Refresh Data
        const data = await getOrderById(orderId);
        setOrder(data.data.order);
    } catch (err) {
        toast.error(typeof err === "string" ? err : "Failed to process request");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <Layout><div className="p-20 text-center text-gray-500">Loading details...</div></Layout>;
  if (!order) return null;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-[80vh]">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex gap-2 print:hidden">
          <Link href="/account?view=orders" className="hover:text-blue-600 hover:underline">← Back to Orders</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Order Details</span>
        </div>

        {/* 1. Header & Timeline */}
        <OrderTracker order={order} onDownloadInvoice={handleDownloadInvoice} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2. Items List */}
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsList products={order.products} />
          </div>

          {/* 3. Summary & Actions */}
          <div className="space-y-6">
            <OrderSummary order={order} onCancelClick={() => setIsModalOpen(true)} />
          </div>
        </div>
      </div>

      {/* --- Cancel Modal (Keep in page for state access) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              {order.status === "Pending" ? "Cancel Order?" : "Request Cancellation"}
            </h3>
            {order.status === "Pending" ? (
              <p className="text-gray-600 mb-6">Are you sure? This will cancel the order immediately.</p>
            ) : (
              <div className="mb-6">
                <p className="text-gray-600 mb-2 text-sm">Reason for cancellation:</p>
                <textarea 
                  className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" rows="3"
                  value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Close</button>
              <button onClick={handleCancelSubmit} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-70">
                {isSubmitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print CSS */}
      <style jsx global>{`
        @media print {
          nav, footer, .print\\:hidden { display: none !important; }
          body { background: white; }
          .max-w-5xl { max-width: 100%; padding: 0; }
          .shadow-sm { box-shadow: none !important; border: 1px solid #eee; }
        }
      `}</style>
    </Layout>
  );
}