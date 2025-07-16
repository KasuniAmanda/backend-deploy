const express = require('express');
const router = express.Router();
const { getItemByCode } = require('../controllers/billController');

router.get('/inventoryitems/:code', getItemByCode);

module.exports = router;
