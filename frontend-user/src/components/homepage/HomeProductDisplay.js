"use client";

import { useState, useEffect } from "react";
import ProductCarouselRow from "./ProductCarouselRow";
import { getHomepageData } from "@/services/productService";

export default function HomeProductDisplay() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHomepageData();
        if (data) {
          setFeatured(data.featured || []);
          setTrending(data.trending || []);
          setNewArrivals(data.newArrivals || []);
        }
      } catch (error) {
        console.error("Failed to load homepage products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-6 sm:py-10 text-center text-gray-400">
        Loading collections...
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 my-6 sm:my-10">

      {featured.length > 0 && (
        <ProductCarouselRow
          title="Featured Collections"
          products={featured}
          moreLink="/products"
        />
      )}

      {trending.length > 0 && (
        <ProductCarouselRow
          title="Trending Now"
          products={trending}
          moreLink="/products"
        />
      )}

      {newArrivals.length > 0 && (
        <ProductCarouselRow
          title="New Arrivals"
          products={newArrivals}
          moreLink="/products"
        />
      )}
      
    </div>
  );
}
