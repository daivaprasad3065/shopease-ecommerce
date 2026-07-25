// src/contexts/CartContext.js
"use client";

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addItemToCart, updateCartItemQuantity, removeItemFromCart } from '@/services/cartService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalMRP, setTotalMRP] = useState(0);
  const [totalAdditionalDiscount, setTotalAdditionalDiscount] = useState(0); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { isLoggedIn } = useAuth();

  const loadCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setTotalAmount(0);
      setTotalMRP(0);
      setTotalAdditionalDiscount(0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getCart();
      const cartData = response?.data?.cart;

      if (cartData && cartData.items) {
        setCartItems(cartData.items);
        setTotalAmount(cartData.totalAmount || 0);
        setTotalMRP(cartData.totalMRP || 0);
        setTotalAdditionalDiscount(cartData.totalAdditionalDiscount || 0);
      } else {
        setCartItems([]);
        setTotalAmount(0);
        setTotalMRP(0);
        setTotalAdditionalDiscount(0);
      }
    } catch (error) {
      console.error("[CartContext] Failed to load cart:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // --- Accepts size and color ---
  const addItem = async (productId, quantity, size = null, color = null) => {
    console.log(`[CartContext] addItem: ${productId}, Qty: ${quantity}, Size: ${size}, Color: ${color}`);
    
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      return false; 
    }
    setIsUpdating(true);
    try {
      // Pass size/color to service
      const response = await addItemToCart(productId, quantity, size, color);
      const cartData = response?.data?.cart;

      if (cartData && cartData.items) {
        setCartItems(cartData.items);
        setTotalAmount(cartData.totalAmount);
        setTotalMRP(cartData.totalMRP || 0);
        setTotalAdditionalDiscount(cartData.totalAdditionalDiscount || 0);
        return true;
      } else {
         await loadCart();
         return false;
      }
    } catch (error) {
      console.error("[CartContext] Failed to add item:", error);
      alert(error.response?.data?.message || "Could not add item to cart.");
      return false; 
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Accepts size and color ---
  const updateItemQuantity = async (productId, quantity, size = null, color = null) => {
    if (!isLoggedIn) return;
    setIsUpdating(true);
    try {
      const response = await updateCartItemQuantity(productId, quantity, size, color);
      const cartData = response?.data?.cart;

      if (cartData) {
        setCartItems(cartData.items || []);
        setTotalAmount(cartData.totalAmount || 0);
        setTotalMRP(cartData.totalMRP || 0);
        setTotalAdditionalDiscount(cartData.totalAdditionalDiscount || 0);
      }
    } catch (error) {
      console.error("[CartContext] Failed to update quantity:", error);
      alert("Could not update item quantity.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Accepts size and color ---
  const removeItem = async (productId, size = null, color = null) => {
    if (!isLoggedIn) return;
    setIsUpdating(true);
    try {
      const response = await removeItemFromCart(productId, size, color);
      const cartData = response?.data?.cart;

      if (cartData && cartData.items) {
        setCartItems(cartData.items);
        setTotalAmount(cartData.totalAmount || 0);
        setTotalMRP(cartData.totalMRP || 0);
        setTotalAdditionalDiscount(cartData.totalAdditionalDiscount || 0);
      } else {
        setCartItems([]);
        setTotalAmount(0);
        setTotalMRP(0);
        setTotalAdditionalDiscount(0);
      }
    } catch (error) {
      console.error("[CartContext] Failed to remove item:", error);
       alert("Could not remove item from cart.");
    } finally {
      setIsUpdating(false);
    }
  };

  const cartItemCount = cartItems.reduce((count, item) => count + (item.quantity || 0), 0);

  const value = {
    cartItems,
    totalAmount,
    totalMRP,
    totalAdditionalDiscount,
    cartItemCount,
    isLoading,
    isUpdating,
    addItem,
    updateItemQuantity,
    removeItem,
    
    loadCart,
    reload: loadCart,  
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}