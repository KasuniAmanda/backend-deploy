const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  subcategoryName: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
