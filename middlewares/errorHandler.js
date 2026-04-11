const ApiError = require('../errors/ApiError');

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = err.errors || [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [];
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid id format';
    errors = [{ field: err.path, msg: 'Invalid ObjectId' }];
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Mongoose validation error';
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      msg: e.message
    }));
  }

  console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    statusCode
  });
};