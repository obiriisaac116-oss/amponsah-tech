const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { login, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }).withMessage('Min 6 characters'),
  ],
  validate,
  changePassword
);

module.exports = router;
