const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  supplierName: {
    type: String,
    required: true,
  },
  phone1: {
    type: String,
    required: true,
  },
  phone2: {
    type: String,
  },
  fax: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  supplyProducts: {
    type: [String], // Array of product names (usually single item per entry)
    required: true,
  },
  paymentTerms: {
    type: String,
  },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
