// backend/src/scripts/setHomepageData.js

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Product = require("../models/Product"); 
const connectDB = require("../config/db");

const updateProducts = async () => {
  try {
    await connectDB();
    console.log("🔥 Connected to DB. Updating products...");

    const products = await Product.find({});

    if (products.length === 0) {
      console.log("❌ No products found! Run your seed script first.");
      process.exit();
    }

    for (let i = 0; i < 4; i++) {
      if (products[i]) {
        products[i].isDealOfTheDay = true;
        products[i].dealExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); 
        await products[i].save();
        console.log(`✅ Marked "${products[i].name}" as Deal of the Day`);
      }
    }

    for (let i = 4; i < 8; i++) {
      if (products[i]) {
        products[i].featured = true;
        await products[i].save();
        console.log(`✅ Marked "${products[i].name}" as Featured`);
      }
    }

    for (let i = 8; i < products.length; i++) {
      if (products[i]) {
        products[i].trending = true;
        await products[i].save();
        console.log(`✅ Marked "${products[i].name}" as Trending`);
      }
    }

    console.log("🎉 Done! Homepage data is ready.");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

updateProducts();