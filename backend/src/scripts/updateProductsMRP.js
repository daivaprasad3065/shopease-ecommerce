// backend/src/scripts/updateProductsMRP.js

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db"); 
const Product = require("../models/Product"); 

const updateProductPrices = async () => {
  try {
    await connectDB();
    console.log("✅ DB Connected for Migration");

    const products = await Product.find({});
    console.log(`Found ${products.length} products. Starting update...`);

    let updatedCount = 0;

    for (const product of products) {
      if (!product.mrp || product.mrp <= product.price) {
        
        const newMRP = Math.ceil(product.price * 1.2);
        
        product.mrp = newMRP;

        await product.save();
        
        console.log(`Updated: ${product.name} | Price: ${product.price} -> MRP: ${product.mrp}`);
        updatedCount++;
      }
    }

    console.log(`🎉 Successfully updated MRP for ${updatedCount} products.`);
    process.exit();
  } catch (err) {
    console.error("❌ Error updating products:", err);
    process.exit(1);
  }
};

updateProductPrices();