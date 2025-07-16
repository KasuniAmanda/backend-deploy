const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  productName: { type: String, required: true },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  },

  quantity: { type: Number, required: true },
  date: { type: Date, required: true },

  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancel'],
    default: 'Pending',
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);