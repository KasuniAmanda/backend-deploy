const Return = require('../models/Return');

async function generateReturnId() {
  const count = await Return.countDocuments();
  const num = String(count + 1).padStart(3, '0');
  return `RET-${num}`;
}

exports.addReturn = async (req, res) => {
  try {
    const returnId = await generateReturnId();
    const newRet = new Return({ ...req.body, returnId });
    await newRet.save();
    res.status(201).json(newRet);
  } catch (err) {
    console.error('AddReturn Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getReturns = async (req, res) => {
  try {
    const list = await Return.find()
      .populate('supplier', 'supplierName')
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error('GetReturns Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateReturn = async (req, res) => {
  try {
    const updated = await Return.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('UpdateReturn Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReturn = async (req, res) => {
  try {
    await Return.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DeleteReturn Error:', err);
    res.status(500).json({ error: err.message });
  }
};