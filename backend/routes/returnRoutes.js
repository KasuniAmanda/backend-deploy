const express = require('express');
const router = express.Router();
const Return = require('../models/returnModel');

// Get all returns
router.get('/', async (req, res) => {
  try {
    const returns = await Return.find();
    console.log(`Fetched ${returns.length} returns`);
    res.json(returns);
  } catch (error) {
    console.error('Error fetching returns:', error.message);
    res.status(500).json({ message: 'Error fetching returns', error: error.message });
  }
});

// Get all return IDs
router.get('/ids', async (req, res) => {
  try {
    const returns = await Return.find().select('return_id');
    const returnIds = returns.map(r => r.return_id);
    console.log(`Fetched ${returnIds.length} return IDs`);
    res.json({ return_ids: returnIds });
  } catch (error) {
    console.error('Error fetching return IDs:', error.message);
    res.status(500).json({ message: 'Error fetching return IDs', error: error.message });
  }
});

// Create a new return
router.post('/', async (req, res) => {
  try {
    const { return_id } = req.body;
    if (!/^RET-\d{3}$/.test(return_id)) {
      console.warn(`Invalid return_id format: ${return_id}`);
      return res.status(400).json({ message: 'Invalid return_id format. Must be RET-XXX (e.g., RET-001)' });
    }
    const returnData = new Return(req.body);
    await returnData.save();

    // console.log(`Created return: ${returnData.return_id}`);

    res.status(201).json(returnData);
  } catch (error) {
    console.error('Error creating return:', error.message);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Return ID already exists', error: error.message });
    } else {
      res.status(400).json({ message: 'Error adding return', error: error.message });
    }
  }
});

// Update a return
router.put('/:id', async (req, res) => {
  try {
    const { return_id } = req.body;
    if (!/^RET-\d{3}$/.test(return_id)) {
      console.warn(`Invalid return_id format: ${return_id}`);
      return res.status(400).json({ message: 'Invalid return_id format. Must be RET-XXX (e.g., RET-001)' });
    }
    const returnData = await Return.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!returnData) {
      console.log(`Return not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Return not found' });
    }
    console.log(`Updated return: ${returnData.return_id}`);
    res.json(returnData);
  } catch (error) {
    console.error('Error updating return:', error.message);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Return ID already exists', error: error.message });
    } else {
      res.status(400).json({ message: 'Error updating return', error: error.message });
    }
  }
});

// Delete a return
router.delete('/:id', async (req, res) => {
  try {
    const returnData = await Return.findByIdAndDelete(req.params.id);
    if (!returnData) {
      console.log(`Return not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Return not found' });
    }
    console.log(`Deleted return: ${returnData.return_id}`);
    res.status(204).json({});
  } catch (error) {
    console.error('Error deleting return:', error.message);
    res.status(400).json({ message: 'Error deleting return', error: error.message });
  }
});

// Get last return ID
router.get('/last-id', async (req, res) => {
  try {
    const lastReturn = await Return.findOne().sort({ return_id: -1 }).select('return_id');
    const lastId = lastReturn ? lastReturn.return_id : null;
    if (lastId && !/^RET-\d{3}$/.test(lastId)) {
      console.warn(`Invalid return_id format in database: ${lastId}`);
      return res.status(500).json({ message: 'Invalid return_id format in database', error: 'Invalid format' });
    }
    console.log(`Fetched last return ID: ${lastId || 'none'}`);
    res.json({ last_id: lastId });
  } catch (error) {
    console.error('Error fetching last return ID:', error.message);
    res.status(500).json({ message: 'Error fetching last return ID', error: error.message });
  }
});

module.exports = router;