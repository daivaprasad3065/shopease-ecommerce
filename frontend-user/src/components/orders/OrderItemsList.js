// frontend-user/src/components/orders/OrderItemsList.js

"use client";
import Image from "next/image";
import Link from "next/link";

export default function OrderItemsList({ products }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Order Items ({products.length})</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {products.map((item, idx) => {
          // Fallback to current price if snapshot price is 0 (for old orders)
          const displayPrice = item.price > 0 ? item.price : item.product?.price || 0;

          return (
            <div key={idx} className="p-4 flex gap-4">
              {/* Image with Link to Product */}
              <Link href={`/products/${item.product?._id}`} className="block w-20 h-24 bg-gray-100 rounded-md relative overflow-hidden flex-shrink-0 border print:hidden hover:opacity-80 transition-opacity">
                {item.product?.images?.[0] ? (
                  <Image 
                    src={item.product.images[0]} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 96px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                )}
              </Link>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/products/${item.product?._id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.product?.brand || "Brand Unavailable"}</p>
                    <div className="flex gap-3 mt-2 text-sm text-gray-600">
                      {item.size && <span className="bg-gray-100 px-2 py-0.5 rounded border text-xs">Size: {item.size}</span>}
                      {item.color && <span className="bg-gray-100 px-2 py-0.5 rounded border text-xs">Color: {item.color}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">₹{displayPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}