const express = require('express');
const router = express.Router();
const ProductSale = require('../models/ProductSale');

router.post('/import', async (req, res) => {
  try {
    await ProductSale.deleteMany(); // optional: clear old data
    await ProductSale.insertMany(req.body);
    res.status(201).json({ message: 'Imported successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Import failed' });
  }
});

module.exports = router;