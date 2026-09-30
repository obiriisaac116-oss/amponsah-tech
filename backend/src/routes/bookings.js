const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  createBooking,
  getBooking,
  cancelBooking,
  getAvailableSlots,
} = require('../controllers/bookingController');

const router = express.Router();

// Public — customers book here
router.post(
  '/',
  [
    body('serviceId').notEmpty().withMessage('Service is required'),
    body('date').isISO8601().withMessage('Valid date required (ISO 8601)'),
    body('time').matches(/^\d{2}:\d{2}$/).withMessage('Time must be HH:MM'),
    body('customer.name').trim().notEmpty().withMessage('Customer name required'),
    body('customer.email').isEmail().withMessage('Valid email required'),
    body('customer.phone').trim().notEmpty().withMessage('Phone number required'),
  ],
  validate,
  createBooking
);

// Public — lookup by confirmation code
router.get('/slots', getAvailableSlots);
router.get('/:id', getBooking);
router.patch('/:id/cancel', cancelBooking);

// Admin
router.get('/', protect, require('../controllers/bookingController').getAllBookings);
router.patch('/:id/status', protect, require('../controllers/bookingController').updateStatus);

module.exports = router;
