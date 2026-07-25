// frontend-user/src/contexts/WishlistContext.js

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  addToWishlistService,
  removeFromWishlistService,
  getWishlistService,
  clearWishlistService,
} from "@/services/wishlistService";
import { moveToCart as moveToCartService } from "@/services/wishlistService";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist initially
  const loadWishlist = async () => {
    try {
      const res = await getWishlistService();
      setWishlist(res?.wishlist?.items || []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const add = async (productId, size = null, color = null) => {
    const res = await addToWishlistService(productId, size, color);
    await loadWishlist();
    return res;
  };

  const remove = async (productId, size = null, color = null) => {
    const res = await removeFromWishlistService(productId, size, color);
    await loadWishlist();
    return res;
  };

  const clear = async () => {
    await clearWishlistService();
    setWishlist([]);
  };

  const move = async (productId, size = null, color = null) => {
    try {
      const res = await moveToCartService(productId, size, color);
      await loadWishlist();
      return res;
    } catch (err) {
      console.error("moveToCart failed:", err, err.payload ?? err);
      throw err;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        add,
        remove,
        move,
        clear,
        reload: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
