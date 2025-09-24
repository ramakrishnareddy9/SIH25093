const jwt = require('jsonwebtoken');
const { TOKEN_TYPES, TOKEN_EXPIRATION } = require('../config/constants');
const User = require('../models/User');
const logger = require('./logger');

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @param {string} type - Token type (access, refresh, etc.)
 * @param {Object} options - Additional options
 * @returns {string} - Generated JWT token
 */
const generateToken = (user, type = TOKEN_TYPES.ACCESS, options = {}) => {
  const payload = {
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    },
    type
  };

  const secret = type === TOKEN_TYPES.ACCESS 
    ? process.env.JWT_ACCESS_SECRET 
    : process.env.JWT_REFRESH_SECRET;

  const expiresIn = options.expiresIn || TOKEN_EXPIRATION[type.toUpperCase()];

  return jwt.sign(payload, secret, { 
    expiresIn,
    issuer: 'smart-student-hub',
    audience: ['student', 'faculty', 'admin']
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @param {string} type - Expected token type
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token, type = TOKEN_TYPES.ACCESS) => {
  const secret = type === TOKEN_TYPES.ACCESS 
    ? process.env.JWT_ACCESS_SECRET 
    : process.env.JWT_REFRESH_SECRET;

  try {
    return jwt.verify(token, secret, {
      issuer: 'smart-student-hub',
      audience: ['student', 'faculty', 'admin']
    });
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`, { 
      type, 
      error: error.name 
    });
    throw error;
  }
};

/**
 * Generate access and refresh tokens for a user
 * @param {Object} user - User object
 * @returns {Object} - Object containing accessToken and refreshToken
 */
const createTokens = (user) => {
  const accessToken = generateToken(user, TOKEN_TYPES.ACCESS);
  const refreshToken = generateToken(user, TOKEN_TYPES.REFRESH, { 
    expiresIn: TOKEN_EXPIRATION.REFRESH 
  });

  return { accessToken, refreshToken };
};

/**
 * Save refresh token to user document
 * @param {string} userId - User ID
 * @param {string} refreshToken - Refresh token to save
 * @returns {Promise<void>}
 */
const saveRefreshToken = async (userId, refreshToken) => {
  try {
    await User.findByIdAndUpdate(userId, { refreshToken });
  } catch (error) {
    logger.error('Failed to save refresh token', { userId, error: error.message });
    throw new Error('Failed to save refresh token');
  }
};

/**
 * Clear refresh token from user document
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
const clearRefreshToken = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  } catch (error) {
    logger.error('Failed to clear refresh token', { userId, error: error.message });
    throw new Error('Failed to clear refresh token');
  }
};

/**
 * Generate email verification token
 * @param {Object} user - User object
 * @returns {string} - Generated token
 */
const generateEmailVerificationToken = (user) => {
  return generateToken(user, TOKEN_TYPES.EMAIL_VERIFICATION, {
    expiresIn: TOKEN_EXPIRATION.EMAIL_VERIFICATION
  });
};

/**
 * Generate password reset token
 * @param {Object} user - User object
 * @returns {string} - Generated token
 */
const generatePasswordResetToken = (user) => {
  return generateToken(user, TOKEN_TYPES.RESET_PASSWORD, {
    expiresIn: TOKEN_EXPIRATION.RESET_PASSWORD
  });
};

module.exports = {
  generateToken,
  verifyToken,
  createTokens,
  saveRefreshToken,
  clearRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken
};
