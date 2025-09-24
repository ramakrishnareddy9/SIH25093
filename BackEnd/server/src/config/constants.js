// Token types
exports.TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  EMAIL_VERIFICATION: 'emailVerification'
};

// User roles
exports.USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student'
};

// Token expiration times (in seconds)
exports.TOKEN_EXPIRATION = {
  ACCESS: 15 * 60,         // 15 minutes
  REFRESH: 7 * 24 * 60 * 60, // 7 days
  RESET_PASSWORD: 10 * 60,  // 10 minutes
  EMAIL_VERIFICATION: 24 * 60 * 60 // 24 hours
};

// Error codes
exports.ERROR_CODES = {
  // Authentication errors (1000-1099)
  AUTH_INVALID_CREDENTIALS: 1001,
  AUTH_ACCOUNT_LOCKED: 1002,
  AUTH_ACCOUNT_DISABLED: 1003,
  AUTH_EMAIL_NOT_VERIFIED: 1004,
  AUTH_INVALID_TOKEN: 1005,
  AUTH_TOKEN_EXPIRED: 1006,
  AUTH_REFRESH_TOKEN_INVALID: 1007,
  
  // Validation errors (2000-2099)
  VALIDATION_ERROR: 2001,
  
  // Resource not found (3000-3099)
  RESOURCE_NOT_FOUND: 3001,
  
  // Permission errors (4000-4099)
  PERMISSION_DENIED: 4001,
  
  // Server errors (5000-5099)
  INTERNAL_SERVER_ERROR: 5001,
  SERVICE_UNAVAILABLE: 5002
};

// Success messages
exports.SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  LOGOUT_SUCCESS: 'Successfully logged out',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  EMAIL_VERIFICATION_SENT: 'Email verification sent',
  EMAIL_VERIFIED: 'Email verified successfully'
};

// Error messages
exports.ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Your account has been locked due to too many failed login attempts',
  ACCOUNT_DISABLED: 'Your account has been disabled',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  INVALID_TOKEN: 'Invalid or missing token',
  TOKEN_EXPIRED: 'Token has expired',
  REFRESH_TOKEN_INVALID: 'Invalid refresh token',
  PERMISSION_DENIED: 'You do not have permission to perform this action',
  RESOURCE_NOT_FOUND: 'The requested resource was not found',
  INTERNAL_SERVER_ERROR: 'An internal server error occurred',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  VALIDATION_ERROR: 'Validation failed',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later'
};
