/**
 * Middleware to handle 404 Route Not Found errors.
 */
function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

module.exports = notFound;
