// backend/src/scripts/migrateLegacyData.js

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");

const migrateData = async () => {
  try {
    // 1. Connect to DB
    await connectDB();
    console.log("✅ DB Connected for Migration");

    // 2. Clear OLD Data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑️  Cleared old Products & Categories");

    // 3. Define Categories
    const categoriesToCreate = [
      { name: "Shirts", image: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg", description: "Men's Shirts" },
      { name: "Formals", image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg", description: "Formal Suits & Wear" },
      { name: "Torn Jeans", image: "https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg", description: "Trendy Jeans" },
      { name: "Jackets", image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg", description: "Winter Jackets" },
      { name: "Trousers", image: "https://images.pexels.com/photos/2080960/pexels-photo-2080960.jpeg", description: "Formal Trousers" },
      { name: "Sneakers", image: "https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg", description: "Casual & Formal Shoes" },
      { name: "Hoodies", image: "https://images.pexels.com/photos/712316/pexels-photo-712316.jpeg", description: "Cozy Hoodies" },
      { name: "Shorts", image: "https://images.pexels.com/photos/4066290/pexels-photo-4066290.jpeg", description: "Summer Shorts" }
    ];

    const createdCategories = [];
    for (const catData of categoriesToCreate) {
      const newCat = new Category(catData);
      await newCat.save(); 
      createdCategories.push(newCat);
    }
    console.log(`✅ Created ${createdCategories.length} Categories`);

    const catMap = {};
    createdCategories.forEach(c => { catMap[c.name] = c._id; });

    const productsToCreate = [
      {
        name: "Classic White Shirt",
        price: 1499,
        mrp: 1799,
        category: catMap["Shirts"],
        subcategory: "Formal",
        description: "A premium cotton formal shirt, slim fit, perfect for office wear.",
        images: ["https://as2.ftcdn.net/v2/jpg/14/94/35/91/1000_F_1494359106_kHPs980OF7u9.jpg"],
        stock: 25,
        brand: "Raymond",
        discount: 15,
        featured: true,
        tags: ["cotton", "formal", "slim fit"],
        hasVariants: true,
        variants: [{ color: "White", size: "M", stock: 10 }, { color: "White", size: "L", stock: 15 }]
      },
      {
        name: "Men Blue Regular Fit Shirt",
        price: 1779,
        mrp: 2135,
        category: catMap["Shirts"],
        subcategory: "Casual",
        description: "A classic blue regular fit shirt, perfect for casual outings.",
        images: ["https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
        stock: 100,
        brand: "Satya's Fashion",
        discount: 11,
        featured: true,
        tags: ["shirt", "blue", "casual", "men"],
        hasVariants: true,
        variants: [{ color: "Blue", size: "M", stock: 50 }, { color: "Blue", size: "L", stock: 50 }]
      },
      {
        name: "Men Maroon Solid Wedding Suit",
        price: 5999,
        mrp: 7199,
        category: catMap["Formals"],
        subcategory: "Formal",
        description: "Look sharp and sophisticated in this elegant maroon solid wedding suit.",
        images: ["https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
        stock: 50,
        brand: "Satya's Fashion",
        discount: 60,
        featured: true,
        tags: ["suit", "maroon", "wedding", "formal", "men"],
        hasVariants: true,
        variants: [{ color: "Maroon", size: "40", stock: 25 }, { color: "Maroon", size: "42", stock: 25 }]
      },
      {
        name: "Denim Rugged Jeans",
        price: 1999,
        mrp: 2399,
        category: catMap["Torn Jeans"],
        subcategory: "Casual",
        description: "A stylish pair of rugged denim jeans that offer both comfort and a modern look.",
        images: ["https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
        stock: 117,
        brand: "Denim Co.",
        discount: 33,
        featured: false,
        tags: ["jeans", "denim", "rugged", "casual", "men"],
        hasVariants: true,
        variants: [{ color: "Blue", size: "32", stock: 60 }, { color: "Blue", size: "34", stock: 57 }]
      },
      {
        name: "Olive Green Bomber Jacket",
        price: 2999,
        mrp: 3599,
        category: catMap["Jackets"],
        subcategory: "Winter",
        description: "Stay warm and stylish with this trendy olive green bomber jacket.",
        images: ["https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
        stock: 75,
        brand: "Satya's Fashion",
        discount: 50,
        featured: true,
        tags: ["jacket", "bomber", "olive", "winter", "men"],
        hasVariants: true,
        variants: [{ color: "Olive", size: "M", stock: 35 }, { color: "Olive", size: "L", stock: 40 }]
      },
      {
        name: "Men Grey Casual T-Shirt",
        price: 699,
        mrp: 839,
        category: catMap["Shirts"],
        subcategory: "Casual",
        description: "A comfortable and stylish grey t-shirt for everyday wear.",
        images: ["https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
        stock: 149,
        brand: "Urban Style",
        discount: 30,
        featured: false,
        trending: true,
        tags: ["t-shirt", "grey", "casual", "men", "summer"],
        hasVariants: true,
        variants: [{ color: "Grey", size: "M", stock: 70 }, { color: "Grey", size: "L", stock: 79 }]
      },
      {
        name: "Formal Black Trousers",
        price: 1499,
        mrp: 1799,
        category: catMap["Trousers"],
        subcategory: "Formal",
        description: "Classic black formal trousers, tailored for a sharp and professional look.",
        images: ["https://images.pexels.com/photos/2080960/pexels-photo-2080960.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
        stock: 80,
        brand: "Satya's Fashion",
        discount: 40,
        featured: false,
        tags: ["trousers", "black", "formal", "men"],
        hasVariants: true,
        variants: [{ color: "Black", size: "32", stock: 40 }, { color: "Black", size: "34", stock: 40 }]
      },
      {
        name: "Navy Blue Checkered Shirt",
        price: 1899,
        mrp: 2279,
        category: catMap["Shirts"],
        subcategory: "Casual",
        description: "A versatile navy blue checkered shirt that can be dressed up or down.",
        images: ["https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg"],
        stock: 90,
        brand: "Satya's Fashion",
        discount: 14,
        featured: true,
        tags: ["shirt", "checkered", "navy", "casual", "men"],
        hasVariants: true,
        variants: [{ color: "Navy", size: "M", stock: 45 }, { color: "Navy", size: "L", stock: 45 }]
      },
      {
        name: "Stylish Black Loafers",
        price: 2499,
        mrp: 2999,
        category: catMap["Sneakers"],
        subcategory: "Formal",
        description: "Complete your look with these stylish black loafers.",
        images: ["https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
        stock: 63,
        brand: "Footprint",
        discount: 50,
        featured: false,
        trending: true,
        tags: ["shoes", "loafers", "black", "formal", "men"],
        hasVariants: true,
        variants: [{ color: "Black", size: "8", stock: 30 }, { color: "Black", size: "9", stock: 33 }]
      },
      {
        name: "Light Grey Hoodie",
        price: 2199,
        mrp: 2639,
        category: catMap["Hoodies"],
        subcategory: "Winter",
        description: "A classic light grey hoodie for a relaxed and comfortable style.",
        images: ["https://images.pexels.com/photos/712316/pexels-photo-712316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
        stock: 107,
        brand: "Urban Style",
        discount: 37,
        featured: true,
        isDealOfTheDay: true,
        dealExpiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Expires in 2 days
        tags: ["hoodie", "grey", "winter", "casual", "men"],
        hasVariants: true,
        variants: [{ color: "Grey", size: "M", stock: 50 }, { color: "Grey", size: "L", stock: 57 }]
      },
      {
        name: "Beige Cargo Shorts",
        price: 999,
        mrp: 1199,
        category: catMap["Shorts"],
        subcategory: "Summer",
        description: "Comfortable and practical beige cargo shorts, perfect for summer adventures.",
        images: ["https://images.pexels.com/photos/4066290/pexels-photo-4066290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
        stock: 126,
        brand: "Outdoor Gear",
        discount: 33,
        featured: false,
        trending: true,
        tags: ["shorts", "cargo", "beige", "summer", "men"],
        hasVariants: true,
        variants: [{ color: "Beige", size: "32", stock: 60 }, { color: "Beige", size: "34", stock: 66 }]
      }
    ];

    // --- Using a Loop for Products too ---
    let prodCount = 0;
    for (const prodData of productsToCreate) {
      const newProd = new Product(prodData);
      await newProd.save(); // Triggers pre('save') hooks for validation/slugs
      prodCount++;
    }

    console.log(`✅ Successfully Migrated ${prodCount} Products with New Schema`);

    process.exit();
  } catch (error) {
    console.error("❌ Error migrating:", error);
    process.exit(1);
  }
};

migrateData();