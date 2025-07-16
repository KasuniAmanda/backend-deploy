const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  return_id: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^RET-\d{3}$/.test(v);
      },
      message: 'return_id must be in format RET-XXX (e.g., RET-001)'
    }
  },
  supplier: { type: String, required: true },
  date: { type: String, required: true },
  product: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  quantity: { type: Number, required: true, min: 1 },
  product_price: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Pending', 'Returned', 'Cancel'], required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure unique index on return_id
returnSchema.index({ return_id: 1 }, { unique: true });

module.exports = mongoose.model('Return', returnSchema);