const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Protect routes — requires a valid JWT in the Authorization header.
 */
async function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Restrict to specific roles.
 * Usage: restrict('superadmin')
 */
function restrict(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { protect, restrict };
