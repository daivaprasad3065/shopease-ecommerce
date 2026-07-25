// ecommerce/backend/src/models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    unique: true, 
    lowercase: true 
  },
  image: { 
    type: String, 
    default: ""
  },
  description: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Auto-slug generator
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().split(' ').join('-');
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);