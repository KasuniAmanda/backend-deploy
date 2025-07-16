const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  code: String,
  productName: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  quantity: Number,
  buyingPrice: Number,
  sellingPrice: Number,
  dateAdded: String,
  image: String,
  ProductStatus: String,
  availableForOffer: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: false // Supplier is optional
  }
});


const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
module.exports = InventoryItem;