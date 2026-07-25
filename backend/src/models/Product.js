// ecommerce/backend/src/models/Product.js
const mongoose = require('mongoose');

// Variant Schema (Size + Color + Stock)
const variantSchema = new mongoose.Schema({
  color: {
     type: String,
     required: true 
  }, 
  size: {
     type: String,
     required: true 
  },
  stock: {
     type: Number,
     default: 0, min: 0 
    },
  sku: {
     type: String 
  } 
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
     type: String,
     required: true, trim: true 
  },
  slug: {
     type: String,
     lowercase: true, index: true 
  },
  price: {
    type: Number,
    required: true, min: 0 
  },
  mrp: { 
    type: Number, required: true, min: 0,
    validate: {
      validator: function(v) { return v >= this.price; },
      message: "MRP must be >= Selling Price"
    }
  },
  discount: { type: Number, default: 0, min: 0, max: 100 },

  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  },
  subcategory: {
    type: String, 
    required: true 
  },
  
  brand: {
    type: String, 
    required: true 
  },
  description: {
    type: String, 
    required: true, 
    trim: true 
  },
  images: [{
    type: String 
  }],
  
  stock: {
    type: Number, 
    default: 0, 
    min: 0 
  },
  hasVariants: {
    type: Boolean, default: false },
  variants: [variantSchema],

  // Dashboard Flags
  featured: {
    type: Boolean, default: false },
  trending: {
    type: Boolean, default: false },
  newArrival: {
    type: Boolean, default: false },
  
  // Deal of the Day
  isDealOfTheDay: {
    type: Boolean, default: false },
  dealExpiry: {
    type: Date, default: null },

  // System
  isActive: {
    type: Boolean, default: true },
  ratings: {
    averageRating: {
      type: Number, default: 0 },
    numberOfReviews: {
      type: Number, default: 0 }
  }
}, { timestamps: true });

// Auto-slug
productSchema.pre('save', function(next) {
  if (!this.isModified('name') && !this.isNew) return next();
  if (!this.slug) {
      this.slug = this.name.toLowerCase().split(' ').join('-');
  }
  next();
});

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);