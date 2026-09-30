const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, restrict } = require('../middleware/auth');
const { getDashboardStats, createAdmin } = require('../controllers/adminController');
const { runReminders } = require('../services/reminderJob');

const router = express.Router();

router.get('/stats', protect, getDashboardStats);

router.post(
  '/create-admin',
  protect,
  restrict('superadmin'),
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ],
  validate,
  createAdmin
);

// Manually trigger reminder job (useful for testing)
router.post('/run-reminders', protect, async (req, res, next) => {
  try {
    await runReminders();
    res.json({ success: true, message: 'Reminder job completed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
