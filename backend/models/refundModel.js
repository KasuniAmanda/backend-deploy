const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  returnId: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  returnDate: { type: Date, required: true },
  refundDate: { type: Date },
  status: {
    type: String,
    enum: ["Refund", "Not Refund"],
    required: true,
    default: "Not Refund",
  },
});

module.exports = mongoose.model("Refund", refundSchema);