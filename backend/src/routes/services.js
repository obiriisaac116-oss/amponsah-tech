const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

const router = express.Router();

const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name required'),
  body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

// Public
router.get('/', getServices);
router.get('/:id', getService);

// Admin only
router.post('/', protect, serviceValidation, validate, createService);
router.put('/:id', protect, serviceValidation, validate, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
