// frontend-user/src/components/account-hub/orders/OrderActionModal.js

"use client";

export default function OrderActionModal({
  isOpen,
  onClose,
  mode,
  order,
  cancelReason,
  setCancelReason,
  onSubmit,
  isSubmitting,
}) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black bg-opacity-40 backdrop-blur-sm animate-fadeIn">

      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden text-[10px] sm:text-sm">

        {/* HEADER */}
        <div className="bg-blue-50 px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-[12px] sm:text-lg font-bold text-gray-800">
            {mode === "cancel"
              ? order.status === "Pending"
                ? "Cancel Order?"
                : "Request Cancellation"
              : "Cancellation Request Details"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-lg">✕</button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 leading-tight">

          {mode === "viewRequest" ? (
            <div className="space-y-2 sm:space-y-3">
              <p className="text-[10px] sm:text-sm">
                <strong>Reason:</strong> {order.cancellationRequest.reason}
              </p>

              {order.cancellationRequest.adminReason && (
                <p className="text-[10px] sm:text-sm">
                  <strong>Admin Response:</strong> {order.cancellationRequest.adminReason}
                </p>
              )}
            </div>
          ) : (
            <div>
              {order.status === "Pending" ? (
                <p className="text-gray-700 text-[10px] sm:text-sm">
                  Are you sure you want to cancel this order? This cannot be undone.
                </p>
              ) : (
                <textarea
                  className="w-full border rounded p-2 sm:p-3 text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  placeholder="Reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2 sm:gap-3">

          <button
            onClick={onClose}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-600 rounded text-[10px] sm:text-sm hover:bg-gray-100"
          >
            Close
          </button>

          {mode === "cancel" && (
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded text-[10px] sm:text-sm hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : "Confirm"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
