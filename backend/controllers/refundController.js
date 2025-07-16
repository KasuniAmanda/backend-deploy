const Refund = require("../models/refundModel");
const Return = require("../models/returnModel");

exports.getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find().sort({ returnDate: -1 });
    res.json(refunds);
  } catch (error) {
    console.error("Get Refunds Error:", error);
    res.status(500).json({ message: "Failed to fetch refunds", error: error.message });
  }
};

exports.createRefund = async (req, res) => {
  try {
    const {
      returnId,
      companyName,
      returnDate,
      refundDate,
      status,
    } = req.body;

    if (
      !returnId ||
      !companyName ||
      !returnDate ||
      !status
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
   
    // Validate return exists and companyName matches
    const returnExists = await Return.findOne({ return_id: returnId });
    if (!returnExists) {
      return res.status(400).json({ message: "Invalid return ID: Return does not exist" });
    }
    if (returnExists.supplier !== companyName) {
      return res.status(400).json({ message: "Company name does not match the return's supplier" });
    }

    // Check duplicate refund for returnId
    const exists = await Refund.findOne({ return_id: returnId });
    if (exists) {
      return res.status(400).json({ message: "Refund for this return ID already exists" });
    }

    // Validate dates
    if (isNaN(new Date(returnDate).getTime())) {
      return res.status(400).json({ message: "Invalid return date" });
    }
    if (refundDate && isNaN(new Date(refundDate).getTime())) {
      return res.status(400).json({ message: "Invalid refund date" });
    }

    const newRefund = new Refund({
      returnId,
      companyName,
      returnDate,
      refundDate: refundDate || null,
      status
    });

    const saved = await newRefund.save();
    res.status(201).json({ message: "Refund created successfully", refund: saved });
  } catch (error) {
    console.error("Create Refund Error:", error);
    res.status(500).json({ message: "Failed to create refund", error: error.message });
  }
};

exports.updateRefund = async (req, res) => {
  try {
    let {
      returnId,
      companyName,
      returnDate,
      refundDate,
      status

    } = req.body;

    if (
      !returnId ||
      !companyName ||
      !returnDate ||
      !status
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate return exists and companyName matches
    const returnExists = await Return.findOne({ return_id: returnId });
    if (!returnExists) {
      return res.status(400).json({ message: "Invalid return ID: Return does not exist" });
    }
    if (returnExists.supplier !== companyName) {
      return res.status(400).json({ message: "Company name does not match the return's supplier" });
    }

    // Check duplicate refund for returnId excluding current doc
    const existing = await Refund.findOne({ return_id: returnId, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ message: "Refund for this return ID already exists" });
    }

    // Validate dates
    if (isNaN(new Date(returnDate).getTime())) {
      return res.status(400).json({ message: "Invalid return date" });
    }

    if (refundDate && isNaN(new Date(refundDate).getTime())) {
      return res.status(400).json({ message: "Invalid refund date" });
    }

    if (status == "Not Refund") {
      refundDate = null; 
    }

    const updatedRefund = await Refund.findByIdAndUpdate(
      req.params.id,
      {
        returnId,
        companyName,
        returnDate,
        refundDate: refundDate || null,
        status
      },
      { new: true, runValidators: true }
    );

    if (!updatedRefund) {
      return res.status(404).json({ message: "Refund not found" });
    }

    res.json({ message: "Refund updated successfully", refund: updatedRefund });
  } catch (error) {
    console.error("Update Refund Error:", error);
    res.status(500).json({ message: "Failed to update refund", error: error.message });
  }
};

exports.deleteRefund = async (req, res) => {
  try {
    const deleted = await Refund.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Refund not found" });
    res.json({ message: "Refund deleted successfully" });
  } catch (error) {
    console.error("Delete Refund Error:", error);
    res.status(500).json({ message: "Failed to delete refund", error: error.message });
  }
};