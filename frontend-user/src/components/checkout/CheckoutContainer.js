// frontend-user/src/components/checkout/CheckoutContainer.js

"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router'; 
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { getAddresses } from '@/services/addressService';
import { createOrder } from '@/services/orderService';
import toast from 'react-hot-toast';

import CheckoutAddress from './CheckoutAddress';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import CheckoutPayment from './CheckoutPayment';
import CheckoutPriceDetails from './CheckoutPriceDetails';

export default function CheckoutContainer() {
  const router = useRouter();
  const { cartItems, loadCart, isLoading: isCartLoading } = useCart();
  
  const { refreshUnread } = useNotifications();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const { source, productId, size, color } = router.query;
  const isDirectBuy = source === 'buy_now';

  // --- FILTER LOGIC ---
  const checkoutItems = useMemo(() => {
    if (!router.isReady) return [];
    if (!isDirectBuy) return cartItems;

    return cartItems.filter(item => {
        const itemId = String(item.productId._id);
        const targetId = String(productId);
        const itemSize = item.size || '';
        const targetSize = size || '';
        const itemColor = item.color || '';
        const targetColor = color || '';

        return (itemId === targetId && itemSize === targetSize && itemColor === targetColor);
    });
  }, [cartItems, isDirectBuy, productId, size, color, router.isReady]);

  // --- TOTALS LOGIC ---
  const checkoutTotalAmount = useMemo(() => {
    return checkoutItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  }, [checkoutItems]);

  const checkoutTotalMRP = useMemo(() => {
    return checkoutItems.reduce((total, item) => {
        const itemMRP = item.productId.mrp || item.productId.price || 0;
        return total + (itemMRP * item.quantity);
    }, 0);
  }, [checkoutItems]);

  const checkoutItemCount = checkoutItems.length;

  // --- FETCH ADDRESSES ---
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddresses();
        const addressList = response.data.addresses || response.data.data || [];
        setAddresses(addressList);
        
        const defaultAddr = addressList.find(addr => addr.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr._id);
        else if (addressList.length > 0) setSelectedAddressId(addressList[0]._id);
      } catch (error) {
        console.error("Failed to load addresses", error);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  // --- CONFIRM ORDER ---
  const handleConfirmOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      setActiveStep(1);
      return;
    }
    
    setIsPlacingOrder(true);
    try {
      const addressSelected = addresses.find(a => a._id === selectedAddressId);
      
      const deliveryAddressPayload = {
        line1: addressSelected.addressLine1,
        line2: addressSelected.addressLine2 || "",
        city: addressSelected.city,
        state: addressSelected.state,
        pincode: addressSelected.zipCode,
        phone: addressSelected.phone,
        alternatePhone: addressSelected.alternatePhone || ""
      };

      const productsPayload = checkoutItems.map(item => ({
        product: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null
      }));

      const orderData = {
        products: productsPayload,
        deliveryAddress: deliveryAddressPayload,
        totalAmount: checkoutTotalAmount, 
        paymentMethod: "Cash on Delivery",
        isPartialCheckout: isDirectBuy 
      };

      // Create the Order
      const response = await createOrder(orderData);
      
      // Extract the New Order ID from Backend Response
      const newOrderId = response.data?.order?._id || response.data?._id;

      toast.success("Order placed successfully!");
      refreshUnread();
      
      // Refresh Cart (Remove items bought)
      await loadCart(); 
      
      // Redirect with Order ID
      if (newOrderId) {
          router.push(`/order-success?orderId=${newOrderId}`);
      } else {
          router.push('/order-success');
      }

    } catch (error) {
      console.error("Order failed:", error);
      
      // 1. Get the exact error message from the object or string
      const errMsg = error?.response?.data?.message || error?.message || (typeof error === 'string' ? error : "Failed to place order.");

      // 2. Check if the error is specifically about Email Verification
      if (errMsg.toLowerCase().includes("verify your email")) {
        toast.error("Please verify your email before placing an order.", { duration: 4000 });
        
        // 3. Redirect to Profile Page
        setTimeout(() => {
           router.push('/account?view=profile');
        }, 1500); // Small delay so they can read the toast
      } else {
        // Standard error toast
        toast.error(errMsg);
      }

    } finally {
      setIsPlacingOrder(false);
    }
  };

  // --- RENDERING ---
  if (isCartLoading || loadingAddresses || !router.isReady) {
      return <p className="text-center py-20">Loading checkout...</p>;
  }

  // Empty State A (Buy Now specific)
  if (isDirectBuy && checkoutItems.length === 0) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Item not found...</h2>
            <Link href="/cart" className="text-blue-600 hover:underline">Go to Cart</Link>
        </div>
    )
  }

  // Empty State B (Normal Cart)
  if (!isDirectBuy && cartItems.length === 0) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link href="/products" className="text-blue-600 hover:underline">Start Shopping</Link>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-100 min-h-screen">
      {isDirectBuy && (
           <div className="bg-blue-600 text-white px-4 py-3 mb-6 rounded-md shadow-md text-sm font-medium flex justify-between items-center">
             <span>⚡ <b>Buy Now Checkout:</b> Purchasing just this item.</span>
             <Link href="/cart" className="underline hover:text-blue-100 ml-4">View Full Cart</Link>
           </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-4">
          <CheckoutAddress 
              activeStep={activeStep}
              changeStep={setActiveStep}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
          />
          <CheckoutOrderSummary 
              activeStep={activeStep}
              changeStep={setActiveStep}
              cartItems={checkoutItems} 
          />
          <CheckoutPayment 
              activeStep={activeStep}
              onConfirmOrder={handleConfirmOrder}
              isPlacingOrder={isPlacingOrder}
          />
        </div>

        <div className="w-full lg:w-1/3 self-start">
          <CheckoutPriceDetails 
              totalAmount={checkoutTotalAmount}
              itemCount={checkoutItemCount}
              totalMRP={checkoutTotalMRP} 
              additionalDiscount={0} 
          />
        </div>
      </div>
    </div>
  );
}