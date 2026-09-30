/**
 * 404 handler — called when no route matched.
 */
function notFound(req, res, next) {
  const err = new Error(`Not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}

/**
 * Central error handler.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Validation error', errors });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  res.status(status).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
