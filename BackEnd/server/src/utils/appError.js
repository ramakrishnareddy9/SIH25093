/**
 * Custom Error class for application-specific errors
 * @extends Error
 */
class AppError extends Error {
  /**
   * Create a new AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Application-specific error code
   * @param {boolean} isOperational - Indicates if the error is operational
   * @param {Object} details - Additional error details
   */
  constructor(
    message,
    statusCode,
    code = 'APP_ERROR',
    isOperational = true,
    details = {}
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);

    // Ensure the error name is set to the class name
    this.name = this.constructor.name;
  }

  /**
   * Create a new AppError for bad request (400) errors
   * @param {string} message - Error message
   * @param {string} code - Application-specific error code
   * @param {Object} details - Additional error details
   * @returns {AppError}
   */
  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST', details = {}) {
    return new AppError(message, 400, code, true, details);
  }

  /**
   * Create a new AppError for unauthorized (401) errors
   * @param {string} message - Error message
   * @param {string} code - Application-specific error code
   * @param {Object} details - Additional error details
   * @returns {AppError}
   */
  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED', details = {}) {
    return new AppError(message, 401, code, true, details);
  }

  /**
   * Create a new AppError for forbidden (403) errors
   * @param {string} message - Error message
   * @param {string} code - Application-specific error code
   * @param {Object} details - Additional error details
   * @returns {AppError}
   */
  static forbidden(message = 'Forbidden', code = 'FORBIDDEN', details = {}) {
    return new AppError(message, 403, code, true, details);
  }

  /**
   * Create a new AppError for not found (404) errors
   * @param {string} message - Error message
   * @param {string} code - Application-specific error code
   * @param {Object} details - Additional error details
   * @returns {AppError}
   */
  static notFound(message = 'Resource not found', code = 'NOT_FOUND', details = {}) {
    return new AppError(message, 404, code, true, details);
  }

  /**
   * Create a new AppError for conflict (409) errors
   * @param {string} message - Error message
   * @param {string} code - Application-specific error code
   * @param {Object} details - Additional error details
   * @returns {AppError}
   */
  static conflict(message = 'Conflict occurred', code = 'CONFLICT', details = {}) {
    return new AppError(message, 409, code, true, details);
  }

  /**
   * Create a new AppError for validation (422) errors
   * @param {Array|Object} errors - Validation errors
   * @param {string} message - Error message
   * @param {string} code - Application-specific error code
   * @returns {AppError}
   */
  static validation(
    errors = [],
    message = 'Validation failed',
    code = 'VALIDATION_ERROR'
  ) {
    return new AppError(message, 422, code, true, { errors });
  }

  /**
   * Create a new AppError for internal server (500) errors
   * @param {string} message - Error message
   * @param {string} code - Application-specific error code
   * @param {Object} details - Additional error details
   * @returns {AppError}
   */
  static internal(
    message = 'Internal Server Error',
    code = 'INTERNAL_SERVER_ERROR',
    details = {}
  ) {
    return new AppError(message, 500, code, false, details);
  }

  /**
   * Create a new AppError for service unavailable (503) errors
   * @param {string} message - Error message
   * @param {string} code - Application-specific error code
   * @param {Object} details - Additional error details
   * @returns {AppError}
   */
  static serviceUnavailable(
    message = 'Service Unavailable',
    code = 'SERVICE_UNAVAILABLE',
    details = {}
  ) {
    return new AppError(message, 503, code, true, details);
  }

  /**
   * Convert the error to a JSON response format
   * @returns {Object} - JSON representation of the error
   */
  toJSON() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      ...(Object.keys(this.details).length > 0 && { details: this.details })
    };
  }

  /**
   * Create an AppError from a JWT error
   * @param {Error} error - JWT error
   * @returns {AppError}
   */
  static fromJwtError(error) {
    if (error.name === 'TokenExpiredError') {
      return AppError.unauthorized('Token has expired', 'TOKEN_EXPIRED');
    }
    if (error.name === 'JsonWebTokenError') {
      return AppError.unauthorized('Invalid token', 'INVALID_TOKEN');
    }
    if (error.name === 'NotBeforeError') {
      return AppError.unauthorized('Token not active', 'TOKEN_NOT_ACTIVE');
    }
    return AppError.unauthorized('Authentication failed', 'AUTHENTICATION_FAILED');
  }

  /**
   * Create an AppError from a Mongoose validation error
   * @param {Error} error - Mongoose validation error
   * @returns {AppError}
   */
  static fromMongooseValidationError(error) {
    const errors = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
      type: err.kind,
      value: err.value
    }));

    return AppError.validation(errors, 'Validation failed', 'VALIDATION_ERROR');
  }

  /**
   * Create an AppError from a Mongoose duplicate key error
   * @param {Error} error - Mongoose duplicate key error
   * @returns {AppError}
   */
  static fromMongoDuplicateKeyError(error) {
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[field];
    const message = `Duplicate field value: ${value}. Please use another value.`;
    
    return AppError.badRequest(
      message,
      'DUPLICATE_KEY',
      { field, value }
    );
  }

  /**
   * Create an AppError from a Mongoose CastError
   * @param {Error} error - Mongoose CastError
   * @returns {AppError}
   */
  static fromMongooseCastError(error) {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return AppError.badRequest(message, 'INVALID_INPUT');
  }
}

module.exports = AppError;
