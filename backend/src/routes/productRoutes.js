// backend/src/routes/productRoutes.js

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { isAdmin } = require("../middlewares/adminVerification"); 

// --- ADMIN ROUTES (Protected by isAdmin) ---
router.post("/add", isAdmin, productController.addProduct);
router.put("/update/:id", isAdmin, productController.updateProduct);
router.delete("/remove/:id", isAdmin, productController.removeProduct);
router.delete("/bulk-remove", isAdmin, productController.bulkRemoveProducts);

// --- PUBLIC ROUTES ---
router.get("/", productController.getAllProducts);
router.get("/homepage", productController.getHomepageProducts);
router.get("/search", productController.searchAndFilterProducts);
router.get("/:id", productController.getProductById);

module.exports = router;