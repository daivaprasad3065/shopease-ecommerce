// frontend-user/src/components/orders/OrderTracker.js

"use client";

export default function OrderTracker({ order, onDownloadInvoice }) {
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  
  // Handle Cancelled State visually
  if (order.status === "Cancelled") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{order._id}</h1>
        <div className="w-full bg-red-50 p-4 rounded-lg border border-red-200 text-center text-red-700 font-bold">
          🚫 This Order has been Cancelled.
        </div>
      </div>
    );
  }

  const currentIndex = steps.indexOf(order.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order._id}</h1>
          <div className="mt-1 space-y-1">
            <p className="text-gray-500 text-sm">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </p>
            
            {/* Header Delivery Date */}
            {order.status === "Delivered" && order.deliveredAt && (
              <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Delivered on: {new Date(order.deliveredAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        <button 
          onClick={onDownloadInvoice}
          className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors print:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Invoice
        </button>
      </div>

      {/* TIMELINE SECTION */}
      <div className="mt-8 px-2 md:px-10">
        <div className="relative flex items-center justify-between w-full mb-8 mt-4 print:hidden">
          
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-1000"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            
            return (
              <div key={step} className="flex flex-col items-center bg-white px-2">
                <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}`}>
                  {isCompleted && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                
                <span className={`text-[10px] sm:text-xs mt-2 font-medium ${isCompleted ? "text-blue-700" : "text-gray-400"}`}>
                  {step}
                </span>

                {/* 🆕 RESTORED: Date under the specific "Delivered" Tick */}
                {step === "Delivered" && order.deliveredAt && isCompleted && (
                    <span className="text-[9px] text-green-600 font-bold mt-0.5">
                        {new Date(order.deliveredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}