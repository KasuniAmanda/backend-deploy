const Invoice = require('../models/invoice');
const InventoryItem = require('../models/InventoryItem'); // Make sure this path is correct

// Generate a numeric invoice ID
const generateInvoiceId = async () => {
  return Date.now().toString();
};

// Create invoice and update inventory quantities
exports.createInvoice = async (req, res) => {
  try {
    const invoiceId = await generateInvoiceId();
    const invoiceData = { ...req.body, invoiceId };

    // Check and reduce inventory quantities
    for (const item of invoiceData.items) {
      const inventory = await InventoryItem.findOne({ code: item.itemCode });

      if (!inventory) {
        return res.status(400).json({ error: `Inventory item not found: ${item.itemCode}` });
      }

      if (inventory.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for item: ${item.itemName}` });
      }

      // Reduce inventory quantity
      inventory.quantity -= item.quantity;
      await inventory.save();
    }

    // Save the invoice
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    res.status(201).json(newInvoice);
  } catch (err) {
    console.error("Error saving invoice:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    console.error("Error fetching invoice:", err.message);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    console.error("Error updating invoice:", err.message);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error("Error deleting invoice:", err.message);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};
