const mongoose = require('mongoose');  // <-- add this line at the top

const ItemSchema = new mongoose.Schema({
  itemCode: String,
  itemName: String,
  itemPrice: Number,
  buyingPrice: Number,
  quantity: Number,
  discount: Number,
  profit: Number
});

const InvoiceSchema = new mongoose.Schema({
  invoiceId: String,
  date: String,
  time: String,
  contact: String,
  name: String,
  address: String,
  email: String,
  items: [ItemSchema],
  subtotal: Number,
  amount: Number,
  cashReceived: Number,
  balance: Number,
  profit: Number
}, {
  timestamps: true,
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
