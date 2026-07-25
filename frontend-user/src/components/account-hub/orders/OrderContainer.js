// frontend-user/src/components/account-hub/orders/OrderContainer.js

"use client";

import { useState, useEffect, useCallback } from "react";
import { getMyOrders, cancelOrder, requestCancelOrder } from "@/services/orderService";
import toast from "react-hot-toast";

import ActiveOrders from "./ActiveOrders";
import PastOrders from "./PastOrders";
import OrderActionModal from "./OrderActionModal";

export default function OrderContainer() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("cancel");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const filters = {};
      if (activeTab === "past") {
        if (selectedYear) filters.year = selectedYear;
        if (selectedMonth) filters.month = selectedMonth;
      }

      const response = await getMyOrders(1, 50, filters);
      setOrders(response.data?.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenCancel = (e, order) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOrder(order);
    setCancelReason("");
    setModalMode("cancel");
    setIsModalOpen(true);
  };

  const handleOpenRequestView = (e, order) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOrder(order);
    setModalMode("viewRequest");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setCancelReason("");
    setIsSubmitting(false);
  };

  const handleSubmitCancellation = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);

    try {
      if (selectedOrder.status === "Pending") {
        await cancelOrder(selectedOrder._id);
        toast.success("Order cancelled");
      } else if (selectedOrder.status === "Processing") {
        if (!cancelReason.trim()) throw "Please provide a reason.";
        await requestCancelOrder(selectedOrder._id, cancelReason);
        toast.success("Cancellation requested");
      }
      closeModal();
      fetchOrders();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const months = [
    { value: "1", label: "Jan" }, { value: "2", label: "Feb" },
    { value: "3", label: "Mar" }, { value: "4", label: "Apr" },
    { value: "5", label: "May" }, { value: "6", label: "Jun" },
    { value: "7", label: "Jul" }, { value: "8", label: "Aug" },
    { value: "9", label: "Sep" }, { value: "10", label: "Oct" },
    { value: "11", label: "Nov" }, { value: "12", label: "Dec" },
  ];

  return (
    <div className="bg-white p-1.5 sm:p-3 md:p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 mb-2 md:mb-6 gap-1.5 md:gap-4">

        {/* TABS */}
        <div className="flex items-center w-full sm:w-auto gap-1.5 md:gap-6">
          <button
            onClick={() => { setActiveTab("active"); setSelectedYear(""); setSelectedMonth(""); }}
            className={`pb-1 md:pb-3 text-[10px] xs:text-[11px] sm:text-sm font-semibold transition-colors border-b-2 flex-1 sm:flex-none text-center ${
              activeTab === "active"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            My Orders
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`pb-1 md:pb-3 text-[10px] xs:text-[11px] sm:text-sm font-semibold transition-colors border-b-2 flex-1 sm:flex-none text-center ${
              activeTab === "past"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            History
          </button>
        </div>

        {/* FILTERS */}
        {activeTab === "past" && (
          <div className="flex gap-1.5 md:gap-2 w-full sm:w-auto">

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="flex-1 sm:flex-none text-[9px] xs:text-[10px] md:text-sm border border-gray-300 rounded-md px-1.5 py-0.5 md:px-2 md:py-1.5"
            >
              <option value="">Yr</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={!selectedYear}
              className="flex-1 sm:flex-none text-[9px] xs:text-[10px] md:text-sm border border-gray-300 rounded-md px-1.5 py-0.5 md:px-2 md:py-1.5 disabled:bg-gray-100 disabled:opacity-50"
            >
              <option value="">Mo</option>
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>

          </div>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center p-4 md:p-10 text-[9.5px] sm:text-sm text-gray-500 animate-pulse">
          Loading...
        </div>
      ) : (
        <div className="text-[9px] xs:text-[10px] sm:text-sm md:text-base leading-tight">
          {activeTab === "active" ? (
            <ActiveOrders
              orders={orders}
              onOpenCancel={handleOpenCancel}
              onOpenRequestView={handleOpenRequestView}
            />
          ) : (
            <PastOrders orders={orders} />
          )}
        </div>
      )}

      <OrderActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        order={selectedOrder}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        onSubmit={handleSubmitCancellation}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
