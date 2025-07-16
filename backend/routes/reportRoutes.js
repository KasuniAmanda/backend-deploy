const express = require('express');
const router = express.Router();

const { getSalesReport } = require('../controllers/reportController'); // adjust path if needed

// GET /api/reports/sales-report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/sales-report', getSalesReport);

module.exports = router;
