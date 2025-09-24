const AppError = require('../utils/appError');
const logger = require('../utils/logger');

/**
 * Handle JWT errors
 * @param {Error} err - Error object
 * @returns {AppError} - New AppError instance
 */
const handleJWTError = (err) => {
  return new AppError('Invalid token. Please log in again!', 401, 'INVALID_TOKEN');
};

/**
 * Handle JWT expired error
 * @returns {AppError} - New AppError instance
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401, 'TOKEN_EXPIRED');
};

/**
 * Handle MongoDB validation errors
 * @param {Error} err - Mongoose validation error
 * @returns {AppError} - New AppError instance
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

/**
 * Handle MongoDB duplicate field errors
 * @param {Error} err - MongoDB duplicate key error
 * @returns {AppError} - New AppError instance
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400, 'DUPLICATE_FIELD');
};

/**
 * Handle MongoDB cast errors
 * @param {Error} err - Mongoose cast error
 * @returns {AppError} - New AppError instance
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400, 'INVALID_ID');
};

/**
 * Send error response in development environment
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Send error response in production environment
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } else {
    // 1) Log error
    logger.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const globalErrorHandler = (err, req, res, next) => {
  // Set default values if not set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logger.error(`[${new Date().toISOString()}] ${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Log the stack in development
  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  }

  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.code = err.code;

  // Handle specific error types
  if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'CastError') error = handleCastErrorDB(error);

  // Send appropriate error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const notFound = (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
    'NOT_FOUND'
  );
  next(error);
};

/**
 * Handle async/await errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function with error handling
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = {
  globalErrorHandler,
  notFound,
  catchAsync,
};
