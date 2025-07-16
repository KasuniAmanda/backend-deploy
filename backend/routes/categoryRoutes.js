const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory
} = require('../controllers/categoryController');

const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');

// Existing category routes
router.get('/', getAllCategories);
router.post('/add', addCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

// 🔄 NEW: Get all categories with their subcategories
router.get('/with-subcategories', async (req, res) => {
  try {
    const categories = await Category.find();

    const data = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Subcategory.find({ categoryId: category._id });
        return {
          _id: category._id,
          categoryName: category.categoryName,
          subcategories,
        };
      })
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories with subcategories', details: error.message });
  }
});

module.exports = router;
