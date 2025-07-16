const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Calculate amount before saving
salesSchema.pre('save', function(next) {
  this.amount = this.quantity * this.price;
  next();
});

const Sales = mongoose.model('Sales', salesSchema);
module.exports = Sales;
