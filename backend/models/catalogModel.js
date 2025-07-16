const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { 
    type: String, 
    required: true 
  },
  quantity: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  dateAdded: { type: Date, required: true }, 
  image: { type: String },
  code: { type: String, unique: true, required: true } //  Product code added here
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
