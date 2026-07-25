// frontend-user/src/components/products/FilterSidebar.js

"use client";

import { useState, useEffect } from "react";
import { getAllCategories } from "@/services/categoryService"; 

export default function FilterSidebar({ selectedCategories, setSelectedCategories }) {
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getAllCategories();
        setCategories(Array.isArray(data) ? data : []); 
      } catch (err) {
        console.error("Failed to load categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName) 
        : [...prev, categoryName]
    );
  };

  if (loading) return <div className="animate-pulse h-20 bg-gray-100 rounded w-full"></div>;

  return (
    <div className="w-full">
      <h3 className="font-bold text-gray-800 text-lg mb-3">Categories</h3>
      
      {categories.length === 0 ? (
        <p className="text-gray-400 text-sm">No categories found.</p>
      ) : (
        <div className="space-y-1">
          {categories.map((cat) => (
            <label 
              key={cat._id} 
              className="flex items-center space-x-3 cursor-pointer py-1 group"
            >
              <input 
                type="checkbox"
                // comparing based on Name because that's what we pass to the URL/Backend
                checked={selectedCategories.includes(cat.name)}
                onChange={() => handleCategoryChange(cat.name)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <span className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm sm:text-base capitalize">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}