const InventoryItem = require('../models/InventoryItem');

const getItemByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const item = await InventoryItem.findOne({ code });

    if (!item) {
      return res.status(404).json({ message: 'Item not found for this code' });
    }

    res.status(200).json({
      name: item.productName,
      price: item.sellingPrice,
      buyingPrice: item.buyingPrice, // ✅ Include this
      code: item.code,
      quantity: item.quantity,
      category: item.category
    });
  } catch (error) {
    console.error('Error fetching item by code:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getItemByCode };
