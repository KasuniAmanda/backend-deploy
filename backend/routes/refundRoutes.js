const express = require("express");
const router = express.Router();
const refundController = require("../controllers/refundController");

router.get("/", refundController.getAllRefunds);
router.post("/", refundController.createRefund);
router.put("/:id", refundController.updateRefund);
router.delete("/:id", refundController.deleteRefund);

module.exports = router;