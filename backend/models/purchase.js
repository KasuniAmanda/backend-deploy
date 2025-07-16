const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/purchase'); // alias of InventoryItem

// GET /api/purchase-reports
router.get('/', async (req, res) => {
  try {
    // Optional: Add date filtering
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate && endDate) {
      filter.dateAdded = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Only get items that were bought (outside products)
    filter.ProductStatus = 'Out-Side'; // or however you define purchase items

    const purchases = await InventoryItem.find(filter)
      .populate('supplier', 'name') // populate supplier name only
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ dateAdded: -1 });

    res.json(purchases);
  } catch (err) {
    console.error('Failed to fetch purchase reports:', err);
    res.status(500).json({ message: 'Server error while fetching purchase reports' });
  }
});

module.exports = router;