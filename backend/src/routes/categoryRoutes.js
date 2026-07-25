// backend/src/routes/categoryRoutes.js

const express = require("express");
const router = express.Router();
const { 
  createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory 
} = require("../controllers/categoryController");
const { isAdmin } = require("../middlewares/adminVerification");

// PUBLIC ROUTES
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// ADMIN ROUTES
router.post("/", isAdmin, createCategory);
router.put("/:id", isAdmin, updateCategory);
router.delete("/:id", isAdmin, deleteCategory);

module.exports = router;