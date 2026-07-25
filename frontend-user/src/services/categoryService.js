import apiService from "./apiService";

export const getAllCategories = async () => {
  try {
    const response = await apiService.get("/categories");
    
    // 1. Get the payload (standard wrapper)
    const payload = response.data.data || response.data;

    // 2. Check if the array is nested inside "categories" property
    if (payload.categories && Array.isArray(payload.categories)) {
        return payload.categories;
    }

    // 3. Check if payload itself is the array
    if (Array.isArray(payload)) {
        return payload;
    }

    // 4. Fallback: return empty array if format is unexpected
    console.warn("Unexpected category response format:", payload);
    return [];

  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};