const InventoryItem = require('../models/InventoryItem');
const multer = require('multer');

// ✅ Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

// ✅ Generate numeric item code
const generateItemCode = async () => {
  const existingItems = await InventoryItem.find();
  let maxCode = 0;
  existingItems.forEach(item => {
    if (item.code) {
      const match = item.code.match(/^\d+$/);
      if (match) {
        const number = parseInt(item.code);
        if (number > maxCode) maxCode = number;
      }
    }
  });
  return String(maxCode + 1).padStart(3, '0');
};

// ✅ Get all inventory items
const getInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find()
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName parentCategoryId')
      .populate('supplier', 'supplierName');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventory items' });
  }
};

// ✅ Add inventory item
const addInventoryItem = async (req, res) => {
  try {
    const {
      productName,
      category,
      subcategory,
      quantity,
      buyingPrice,
      sellingPrice,
      dateAdded,
      availableForOffer,
      ProductStatus,
      supplier,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!productName || !category || !subcategory || !quantity || !buyingPrice || !sellingPrice || !dateAdded || !supplier) {
      return res.status(400).json({ error: 'All fields including supplier are required!' });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number!' });
    }

    if (isNaN(buyingPrice) || buyingPrice <= 0 || isNaN(sellingPrice) || sellingPrice <= 0) {
      return res.status(400).json({ error: 'Prices must be positive numbers!' });
    }

    if (!Date.parse(dateAdded)) {
      return res.status(400).json({ error: 'Invalid date format!' });
    }

    const existingItem = await InventoryItem.findOne({ productName, category, subcategory });
    if (existingItem) {
      return res.status(409).json({
        error: 'Product already exists!',
        message: 'You cannot add this product again as it already exists.',
        code: existingItem.code,
        item: existingItem,
      });
    }

    const code = await generateItemCode();

    const newItem = new InventoryItem({
      code,
      productName,
      category,
      subcategory,
      quantity: parseInt(quantity),
      buyingPrice: parseFloat(buyingPrice).toFixed(2),
      sellingPrice: parseFloat(sellingPrice).toFixed(2),
      dateAdded,
      image,
      availableForOffer: availableForOffer || 'no',
      ProductStatus,
      supplier,
    });

    const savedItem = await newItem.save();

    const populatedItem = await InventoryItem.findById(savedItem._id)
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName parentCategoryId')
      .populate('supplier', 'supplierName');

    res.status(201).json({
      message: 'New item added successfully!',
      code: savedItem.code,
      item: populatedItem,
    });
  } catch (err) {
    res.status(500).json({ error: `Failed to add item: ${err.message}` });
  }
};

// ✅ Inventory count
const getInventoryCount = async (req, res) => {
  try {
    const count = await InventoryItem.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update inventory item
const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    category,
    subcategory,
    quantity,
    buyingPrice,
    sellingPrice,
    dateAdded,
    availableForOffer,
    ProductStatus,
    supplier,
  } = req.body;

  const updateData = {
    productName,
    category,
    subcategory,
    quantity,
    buyingPrice,
    sellingPrice,
    dateAdded,
    availableForOffer,
    ProductStatus,
    supplier,
  };

  if (req.file) {
    updateData.image = req.file.filename;
  }

  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    const populatedUpdatedItem = await InventoryItem.findById(updatedItem._id)
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName parentCategoryId')
      .populate('supplier', 'supplierName');

    res.json(populatedUpdatedItem);
  } catch (error) {
    res.status(500).json({ error: `Failed to update item: ${error.message}` });
  }
};

// ✅ Delete inventory item
const deleteInventoryItem = async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete item: ${error.message}` });
  }
};

// ✅ Report generator (custom, weekly, monthly, with optional supplier filter)
const reportByDateSupplier = async (req, res) => {
  try {
    let { startDate, endDate, supplierId, reportType } = req.query;

    const today = new Date();

    if (reportType === 'weekly') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startDate = startOfWeek;
      endDate = today;
    } else if (reportType === 'monthly') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = startOfMonth;
      endDate = today;
    } else {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
    }

    endDate.setHours(23, 59, 59, 999);

    const filter = {
      dateAdded: { $gte: new Date(startDate), $lte: endDate },
      ProductStatus: 'Out-Side',
    };

    if (supplierId) {
      filter.supplier = supplierId;
    }

    const data = await InventoryItem.find(filter)
      .populate('supplier', 'supplierName')
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName');

    res.json(data);
  } catch (err) {
    console.error('Report error:', err.message);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

module.exports = {
  getInventoryItems,
  addInventoryItem,
  getInventoryCount,
  updateInventoryItem,
  deleteInventoryItem,
  upload,
  reportByDateSupplier, // 👈 Exported for route use
};