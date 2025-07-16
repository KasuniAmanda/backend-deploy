const Supplier = require("../models/Supplier");

// Get all suppliers with optional search and filter
const getSuppliers = async (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = {};

    if (search) {
      query.supplierName = { $regex: search, $options: "i" };
    }

    if (filter) {
      query.supplyProducts = { $in: [new RegExp(filter, "i")] };
    }

    const suppliers = await Supplier.find(query);
    res.json(suppliers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving suppliers", error: error.message });
  }
};

// Get supplier count
const getSupplierCount = async (req, res) => {
  try {
    const count = await Supplier.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving supplier", error: error.message });
  }
};

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const { supplyProducts, ...supplierData } = req.body;

    // Check if a supplier with the same name already exists
    const existingSupplier = await Supplier.findOne({
      supplierName: supplierData.supplierName,
    });

    if (existingSupplier) {
      // Update existing supplier by adding new products to the array
      const newProducts = Array.isArray(supplyProducts)
        ? supplyProducts
        : [supplyProducts];

      // Add only new products that don't already exist
      const uniqueNewProducts = newProducts.filter(
        (product) => !existingSupplier.supplyProducts.includes(product)
      );

      if (uniqueNewProducts.length > 0) {
        existingSupplier.supplyProducts.push(...uniqueNewProducts);
        const updatedSupplier = await existingSupplier.save();

        res.status(200).json({
          message: `Added ${uniqueNewProducts.length} new products to existing supplier`,
          supplier: updatedSupplier,
          addedProducts: uniqueNewProducts,
        });
      } else {
        res.status(400).json({
          message: "All selected products already exist for this supplier",
          supplier: existingSupplier,
        });
      }
    } else {
      // Create new supplier with all products in one entry
      const supplier = new Supplier({
        date: supplierData.date,
        supplierName: supplierData.supplierName,
        phone1: supplierData.phone1,
        phone2: supplierData.phone2,
        fax: supplierData.fax,
        email: supplierData.email,
        address: supplierData.address,
        supplyProducts: Array.isArray(supplyProducts)
          ? supplyProducts
          : [supplyProducts],
        paymentTerms: supplierData.paymentTerms,
      });

      const newSupplier = await supplier.save();
      res.status(201).json({
        message: "New supplier created successfully",
        supplier: newSupplier,
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating supplier", error: error.message });
  }
};

// Update a supplier by ID
const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedSupplier) {
      res.json(updatedSupplier);
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating supplier", error: error.message });
  }
};

// Delete a supplier by ID
const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (deletedSupplier) {
      res.json({ message: "Supplier deleted successfully" });
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting supplier", error: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplierCount,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
