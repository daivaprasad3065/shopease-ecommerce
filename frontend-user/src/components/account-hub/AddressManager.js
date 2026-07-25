// src/components/account-hub/AddressManager.js

"use client";

import { useState, useEffect } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '@/services/addressService';

/* Base template for empty form */
const blankAddress = {
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  isDefault: false,
};

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await getAddresses();
        setAddresses(response.data.addresses || []);
      } catch (err) {
        setError('Failed to load your addresses.');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  /* ------------------ Handlers --------------------- */

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id);
        setAddresses(prev => prev.filter(a => a._id !== id));
      } catch (err) {
        alert("Failed to delete address. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async (formData) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData);
      } else {
        await addAddress(formData);
      }
      const res = await getAddresses();
      setAddresses(res.data.addresses || []);
      setIsFormOpen(false);
      setEditingAddress(null);
    } catch (err) {
      alert("Failed to save address. Please try again.");
    }
  };

  /* ------------------ UI --------------------- */

  if (loading) return <div className="p-6 text-center text-gray-500 text-[11px]">Loading addresses...</div>;
  if (error) return <div className="p-6 text-center text-red-500 text-[11px]">{error}</div>;

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-[12px] sm:text-lg md:text-xl font-bold text-gray-800">
          Manage Addresses
        </h2>

        {!isFormOpen && (
          <button 
            onClick={handleAddNewClick}
            className="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md 
                       text-[10px] sm:text-xs md:text-sm font-semibold hover:bg-blue-700 
                       transition shadow-sm"
          >
            + Add New
          </button>
        )}
      </div>

      {/* FORM OPEN */}
      {isFormOpen ? (
        <AddressForm 
          address={editingAddress}
          onSave={handleSaveAddress}
          onCancel={handleCancel}
        />
      ) : (

        /* EMPTY LIST */
        addresses.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200 text-[10px] sm:text-sm text-gray-500">
            You have no saved addresses.
          </div>
        ) : (

          /* ADDRESS LIST */
          <div className="space-y-4">
            {addresses.map(addr => (
              <div key={addr._id}
                className="border p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-white transition 
                           text-[10px] sm:text-sm relative">

                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">

                  {/* LEFT — ADDRESS */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-[11px] sm:text-base text-gray-900 truncate">
                        {addr.name}
                      </p>

                      {addr.isDefault && (
                        <span className="text-[9px] sm:text-[10px] font-bold text-green-700 bg-green-100 px-2 py-[2px] rounded-full uppercase">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="text-gray-600 leading-tight space-y-0.5">
                      <p className="truncate">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="truncate">{addr.addressLine2}</p>}
                      <p>{addr.city}, {addr.state} - {addr.zipCode}</p>

                      <p className="pt-1 font-medium text-gray-800 flex items-center gap-1">
                        <span>📞</span> {addr.phone}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT — ACTION BUTTONS */}
                  <div className="flex sm:flex-col gap-2 justify-end border-t sm:border-0 pt-2 sm:pt-0">

                    <button
                      onClick={() => handleEditClick(addr)}
                      className="text-blue-600 text-[10px] sm:text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                      <span className="text-[14px]">✏️</span> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteClick(addr._id)}
                      className="text-red-600 text-[10px] sm:text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                      <span className="text-[14px]">🗑️</span> Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

/* --------------------------------------------------------------------
   ADDRESS FORM  (scaled down for mobile, full UI retained)
-------------------------------------------------------------------- */
function AddressForm({ address, onSave, onCancel }) {
  const [formData, setFormData] = useState(address || blankAddress);

  useEffect(() => setFormData(address || blankAddress), [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 sm:py-2 px-2 sm:px-3 " +
    "focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[10px] sm:text-sm";

  const labelClass = "block text-[10px] sm:text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">

      <h3 className="text-[12px] sm:text-lg font-bold text-gray-800 border-b pb-2 mb-3">
        {address ? "Edit Address" : "Add New Address"}
      </h3>

      {/* FIELDS */}
      <div>
        <label className={labelClass}>Full Name</label>
        <input name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>Address Line 1</label>
        <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>Address Line 2 (Optional)</label>
        <input name="addressLine2" value={formData.addressLine2 || ''} onChange={handleChange} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input name="city" value={formData.city} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input name="state" value={formData.state} onChange={handleChange} className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Zip Code</label>
          <input name="zipCode" value={formData.zipCode} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} required />
        </div>
      </div>

      <div className="flex items-center pt-1">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label className="ml-2 text-[10px] sm:text-sm text-gray-700">Set as default address</label>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 pt-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-[11px] sm:text-sm font-semibold hover:bg-blue-700 shadow-sm"
        >
          {address ? "Save Changes" : "Save Address"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-[11px] sm:text-sm font-semibold hover:bg-gray-50 shadow-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
