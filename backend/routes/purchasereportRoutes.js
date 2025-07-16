const express = require('express');
const router = express.Router();
const Inventory = require('../models/InventoryItem'); // Adjust path & model if needed

/**
 * GET /api/purchase-report
 * Optional Query Parameters:
 * - startDate (YYYY-MM-DD)
 * - endDate (YYYY-MM-DD)
 * 
 * Returns all purchases with ProductStatus = 'Out-Side' filtered by date range if provided.
 */
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build MongoDB query filter
    const filter = { ProductStatus: 'Out-Side' };

    if (startDate || endDate) {
      filter.dateAdded = {};
      if (startDate) filter.dateAdded.$gte = new Date(startDate);
      if (endDate) filter.dateAdded.$lte = new Date(endDate);
    }

    const purchases = await Inventory.find(filter)
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName')
      .populate('supplier', 'supplierName')
      .sort({ dateAdded: -1 });

    res.json(purchases);
  } catch (err) {
    console.error('Failed to fetch purchase report:', err);
    res.status(500).json({ error: 'Server error fetching purchase report' });
  }
});

module.exports = router;