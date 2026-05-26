/**
 * Global error handler middleware.
 * Handles Mongoose validation errors, cast errors, and generic errors.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ErrorHandler]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const fields = {};
    Object.keys(err.errors).forEach((key) => {
      fields[key] = err.errors[key].message;
    });
    return res.status(400).json({
      error: true,
      message: 'Validation failed',
      fields,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: true,
      message: `Invalid value for field "${err.path}": ${err.value}`,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      error: true,
      message: 'Duplicate entry — a record with these details already exists.',
    });
  }

  // Default 500
  return res.status(err.statusCode || 500).json({
    error: true,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
