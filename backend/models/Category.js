// 1. models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        unique: true,
        required: true
    }
});
  
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;