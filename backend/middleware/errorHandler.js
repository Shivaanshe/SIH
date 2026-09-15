/**
 * ============================================================================
 * FUNCTION SPECIFICATION: errorHandler (Global Express Error Middleware)
 * ============================================================================
 * WHAT IT NEEDS TO DO:
 * 1. Catch unhandled errors passed via next(error) from any route controller.
 * 2. Identify common Mongoose errors:
 *    - CastError (invalid ObjectId format) -> 400 Bad Request
 *    - ValidationError (missing or invalid schema fields) -> 400 Bad Request
 *    - 11000 Duplicate Key Error (e.g., email or id already exists) -> 409 Conflict
 * 3. Log the error stack in development mode.
 * 4. Return clean, consistent JSON: { success: false, message, error }
 */
export function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose CastError
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with invalid identifier: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate entry error: A record with that ${field} already exists.`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('💥 [Server Error]:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}
