const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getCustomers,
  getCustomer,
  updateCustomer,
} = require('../controllers/customerController');

const router = express.Router();

// Admin only
router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomer);
router.put('/:id', protect, updateCustomer);

module.exports = router;
