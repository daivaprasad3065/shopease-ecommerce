// backend/src/controllers/categoryController.js

const Category = require("../models/Category");
const Product = require("../models/Product"); 
const { successResponse, errorResponse } = require("../middlewares/responseHandler");

// 1. Create a New Category (Admin Only)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, image, description } = req.body;

    if (!name) {
      return errorResponse(res, "Category name is required", 400);
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existingCategory) {
      return errorResponse(res, "Category already exists", 400);
    }

    const newCategory = new Category({
      name,
      image,
      description
    });

    await newCategory.save();

    return successResponse(res, "Category created successfully", { category: newCategory }, 201);
  } catch (error) {
    // Handle duplicate key error (if slug collision happens)
    if (error.code === 11000) {
      return errorResponse(res, "Category with this name already exists", 400);
    }
    next(error);
  }
};

// 2. Get All Categories (Public)
// Used for the Header Menu and Sidebar
exports.getAllCategories = async (req, res, next) => {
  try {
    // Fetch only active categories
    const categories = await Category.find({ isActive: true }).select("name slug image description");

    return successResponse(res, "Categories fetched successfully", { categories });
  } catch (error) {
    next(error);
  }
};

// 3. Get Single Category (Public)
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, "Category not found", 404);

    return successResponse(res, "Category fetched", { category });
  } catch (error) {
    next(error);
  }
};

// 4. Update Category (Admin Only)
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, image, description, isActive } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image, description, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) return errorResponse(res, "Category not found", 404);

    return successResponse(res, "Category updated successfully", { category: updatedCategory });
  } catch (error) {
    next(error);
  }
};

// 5. Delete Category (Admin Only)
exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    // SAFETY CHECK: Don't delete if products rely on this category
    const productCount = await Product.countDocuments({ category: categoryId });
    
    if (productCount > 0) {
      return errorResponse(
        res, 
        `Cannot delete this category. It contains ${productCount} products. Please move or delete them first.`, 
        400
      );
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) return errorResponse(res, "Category not found", 404);

    return successResponse(res, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};