"use client";

import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutOrderSummary({ activeStep, changeStep, cartItems: propItems }) {
  
  const { cartItems: contextItems } = useCart();
  const cartItems = propItems || contextItems;

  const isOpen = activeStep === 2;
  const isDone = activeStep > 2;

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isOpen ? 'text-blue-600' : 'text-gray-500'}`}>
          <span className="flex items-center justify-center w-6 h-6 text-xs bg-gray-200 text-gray-600 rounded-sm">2</span>
          Order Summary
          {isDone && <span className="ml-2 text-xs text-blue-600">✓</span>}
        </h2>
        {isDone && (
          <button onClick={() => changeStep(2)} className="text-blue-600 text-sm font-medium border border-gray-300 px-4 py-1 rounded hover:bg-blue-50">
            CHANGE
          </button>
        )}
      </div>

      {/* Minimized View */}
      {isDone && (
        <div className="mt-2 pl-8 text-sm font-medium text-gray-900">
          {cartItems.length} Items
        </div>
      )}

      {/* Expanded View */}
      {isOpen && (
        <div className="mt-4 pl-0 sm:pl-8">
          <div className="space-y-6">
            {cartItems.map((item) => {
                const product = item.productId || {};
                const imageUrl = product.images?.[0] || '/placeholder.jpg';
                
                // Pricing Logic
                const basePrice = item.priceAtPurchase || product.price || 0; 
                const extraDiscount = item.discountAtPurchase || 0; 
                
                // Calculate Unit Price
                const finalPrice = extraDiscount > 0 
                  ? Math.round(basePrice - (basePrice * extraDiscount / 100)) 
                  : basePrice;

                // Calculate Total for this line item (Unit Price * Qty)
                const itemTotal = finalPrice * item.quantity;

                const mrp = item.mrpAtPurchase > 0 ? item.mrpAtPurchase : (product.mrp || basePrice); 
                const baseDiscountPercent = mrp > basePrice ? Math.round(((mrp - basePrice) / mrp) * 100) : 0;
                
                return (
                <div key={item._id || Math.random()} className="flex flex-col sm:flex-row gap-4 border-b pb-4 last:border-0">
                  <div className="w-24 h-24 relative flex-shrink-0 mx-auto sm:mx-0 border border-gray-100 rounded overflow-hidden">
                    <Image src={imageUrl} alt={product.name || 'Product'} fill className="object-cover" sizes="100px" />
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-1 uppercase">{product.brand}</p>
                    
                    {/* Variant Display */}
                    {(item.size || item.color) && (
                        <div className="inline-flex items-center gap-2 text-xs bg-gray-50 px-2 py-1 rounded text-gray-700 mb-2 border border-gray-100">
                            {item.color && <span>{item.color}</span>}
                            {item.color && item.size && <span className="text-gray-300">|</span>}
                            {item.size && <span>Size: {item.size}</span>}
                        </div>
                    )}
                    
                    {/* Pricing */}
                    <div className="flex flex-col items-center sm:items-start mt-1">
                        <div className="flex items-baseline gap-2 flex-wrap justify-center sm:justify-start w-full">
                            <span className="font-bold text-xl text-gray-900">₹{finalPrice.toFixed(2)}</span>
                            
                            {extraDiscount > 0 && (
                                <span className="text-sm text-gray-500 line-through">₹{basePrice}</span>
                            )}

                            {mrp > basePrice && (
                                <span className="text-sm text-gray-400 line-through">₹{mrp}</span>
                            )}
                            
                            {baseDiscountPercent > 0 && (
                                <span className="text-xs font-semibold text-green-600">{baseDiscountPercent}% Off</span>
                            )}
                        </div>

                        {extraDiscount > 0 && (
                            <div className="mt-1">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-medium">
                                    Extra {extraDiscount}% Applied
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Quantity & Total Display */}
                    <div className="text-sm text-gray-600 mt-2 flex items-center justify-center sm:justify-start">
                          <span>Qty: <strong>{item.quantity}</strong></span>
                          
                          {/* Only show Total if quantity is greater than 1 */}
                          {item.quantity > 1 && (
                            <span className="text-xs font-medium text-green-600 ml-2 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                (Total: ₹{itemTotal.toFixed(2)})
                            </span>
                          )}
                    </div>

                  </div>
                </div>
                );
            })}
            
            <div className="flex justify-end">
              <button 
                onClick={() => changeStep(3)}
                className="bg-orange-500 text-white px-10 py-3 rounded-sm text-sm font-bold hover:bg-orange-600 shadow-sm uppercase w-full sm:w-auto transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}