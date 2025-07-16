const InventoryItem = require('../models/InventoryItem');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getSubcategoriesByCategory = async (req, res) => {
  const { categoryId } = req.query;
  try {
    const subcategories = await Subcategory.find({ categoryId });
    res.status(200).json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.query;
  try {
    const products = await InventoryItem.find({ category: categoryId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductsBySubcategory = async (req, res) => {
  const { subcategoryId } = req.query;
  try {
    const products = await InventoryItem.find({ subcategory: subcategoryId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductsBySearch = async (req, res) => {
  const { query } = req.query; // Extract the query parameter
  try {
    const products = await InventoryItem.find({
      $or: [
        { productName: { $regex: query, $options: 'i' } }, // Correctly use 'query'
        { code: { $regex: query, $options: 'i' } }         // Correctly use 'query'
      ]
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



module.exports = {
  getCategories,
  getProductsByCategory,
  getProductsBySearch,
  getSubcategoriesByCategory,
  getProductsBySubcategory,
};
