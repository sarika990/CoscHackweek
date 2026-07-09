/**
 * Centralized global error handling middleware.
 */
function errorHandler(err, req, res, next) {
  // If status code is 200, default to 500 internal server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

module.exports = errorHandler;
