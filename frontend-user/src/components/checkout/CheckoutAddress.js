// src/components/checkout/CheckoutAddress.js

"use client";

import Link from 'next/link';

export default function CheckoutAddress({ 
  activeStep, 
  changeStep, 
  addresses, 
  selectedAddressId, 
  setSelectedAddressId 
}) {
  const isOpen = activeStep === 1;
  const isDone = activeStep > 1;
  const selectedAddress = addresses.find(a => a._id === selectedAddressId);

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isOpen ? 'text-blue-600' : 'text-gray-500'}`}>
          <span className="flex items-center justify-center w-6 h-6 text-xs bg-gray-200 text-gray-600 rounded-sm">1</span>
          Delivery Address
          {isDone && <span className="ml-2 text-xs text-blue-600">✓</span>}
        </h2>
        {isDone && (
          <button onClick={() => changeStep(1)} className="text-blue-600 text-sm font-medium border border-gray-300 px-4 py-1 rounded hover:bg-blue-50">
            CHANGE
          </button>
        )}
      </div>

      {/* Minimized View (When step is done) */}
      {isDone && selectedAddress && (
        <div className="mt-2 pl-8 text-sm">
          <p className="font-medium text-gray-900">
            {selectedAddress.name} <span className="font-normal text-gray-600 ml-2">{selectedAddress.phone}</span>
          </p>
          <p className="text-gray-500 truncate">
            {selectedAddress.addressLine1}, {selectedAddress.city} - {selectedAddress.zipCode}
          </p>
        </div>
      )}

      {/* Expanded View (When active) */}
      {isOpen && (
        <div className="mt-4 pl-0 sm:pl-8">
          {addresses.length === 0 ? (
             <div className="text-center py-4">
               <p className="text-sm text-gray-500 mb-2">No addresses found.</p>
               <Link href="/account?view=addresses" className="text-blue-600 text-sm font-bold hover:underline">+ ADD NEW ADDRESS</Link>
             </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <label 
                  key={addr._id} 
                  className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${selectedAddressId === addr._id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
                >
                  <input 
                    type="radio" 
                    name="address" 
                    className="mt-1 accent-blue-600"
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                  />
                  <div className="w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">{addr.name}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded uppercase">{addr.isDefault ? 'Home' : 'Work'}</span>
                        <span className="font-bold text-gray-900 ml-2">{addr.phone}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {addr.addressLine1}, {addr.city}, {addr.state} - <span className="font-bold">{addr.zipCode}</span>
                    </p>
                    
                    {/* "Deliver Here" Button only appears on the selected card */}
                    {selectedAddressId === addr._id && (
                       <button 
                         onClick={() => changeStep(2)} // Move to next step
                         className="mt-3 bg-orange-500 text-white px-6 py-3 rounded-sm text-sm font-bold hover:bg-orange-600 shadow-sm uppercase"
                       >
                         Deliver Here
                       </button>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      <Link href="/account?view=addresses" className="block text-blue-600 text-sm mt-2">+ Add a new address</Link>
    </div>
  );
}