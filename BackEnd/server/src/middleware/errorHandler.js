const logger = require('../utils/logger');
const { ValidationError } = require('joi');
const { JsonWebTokenError } = require('jsonwebtoken');
const { MongoError } = require('mongodb');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Log the error for debugging
  logger.error(`[${new Date().toISOString()}] ${err.stack || err}`);

  // Handle Joi validation errors
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
  }
  // Handle MongoDB duplicate key errors
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value: ${field}. Please use another value.`;
    errors = [{
      field,
      message: `This ${field} is already in use.`
    }];
  }
  // Handle JWT errors
  else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  // Handle MongoDB errors
  else if (err instanceof MongoError) {
    statusCode = 400;
    message = 'Database error';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
