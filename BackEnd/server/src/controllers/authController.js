const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createTokens, verifyToken } = require('../utils/tokenUtils');
const { 
  TOKEN_TYPES, 
  TOKEN_EXPIRATION,
  ERROR_CODES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} = require('../config/constants');
const logger = require('../utils/logger');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        code: ERROR_CODES.VALIDATION_ERROR
      });
    }

    const { name, email, password, role = 'student', department, studentId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
        code: ERROR_CODES.AUTH_EMAIL_EXISTS
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      studentId,
      emailVerificationToken: crypto.randomBytes(32).toString('hex')
    });

    // Generate tokens
    const { accessToken, refreshToken } = createTokens(user);
    
    // Save refresh token to database
    await user.updateOne({ refreshToken });

    // Send welcome email with verification link
    try {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
      
      // Set verification token and expiration (24 hours)
      user.emailVerificationToken = emailVerificationToken;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      
      await user.save({ validateBeforeSave: false });
      
      // Create verification URL
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
      
      // Send welcome email with verification link
      await emailService.sendWelcomeEmail(user.email, user.name, verificationUrl);
      
      logger.info(`Verification email sent to ${user.email}`);
    } catch (error) {
      logger.error('Error sending welcome/verification email:', error);
      // Don't fail the request if email sending fails
    }

    // Remove sensitive data before sending response
    user.password = undefined;
    user.refreshToken = undefined;
    user.emailVerificationToken = undefined;

    // Set tokens in response headers
    res.setHeader('x-access-token', accessToken);
    res.setHeader('x-refresh-token', refreshToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: { user },
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        code: ERROR_CODES.VALIDATION_ERROR
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password +refreshToken');
    
    // Check if user exists and password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in',
        code: ERROR_CODES.AUTH_EMAIL_NOT_VERIFIED
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated',
        code: ERROR_CODES.AUTH_ACCOUNT_DISABLED
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = createTokens(user);
    
    // Save refresh token to database
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Remove sensitive data before sending response
    user.password = undefined;
    user.refreshToken = undefined;

    // Set tokens in response headers
    res.setHeader('x-access-token', accessToken);
    res.setHeader('x-refresh-token', refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user },
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
        code: ERROR_CODES.VALIDATION_ERROR
      });
    }

    // Verify refresh token
    const decoded = await verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
    
    // Find user by ID from token
    const user = await User.findById(decoded.user.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token',
        code: ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID
      });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = createTokens(user);
    
    // Save new refresh token to database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Set new tokens in response headers
    res.setHeader('x-access-token', newAccessToken);
    res.setHeader('x-refresh-token', newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`, { error });
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
        code: ERROR_CODES.AUTH_REFRESH_TOKEN_INVALID
      });
    }
    
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    
    // Clear refresh token from database
    await User.findByIdAndUpdate(id, { refreshToken: null });
    
    res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address',
        code: ERROR_CODES.RESOURCE_NOT_FOUND
      });
    }
    
    // Generate password reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      // Create reset URL
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      
      // Send password reset email using the template
      await emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetUrl,
        '10 minutes'
      );

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
        code: 'PASSWORD_RESET_EMAIL_SENT'
      });
    } catch (error) {
      // Reset the token if email sending fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      logger.error('Error sending password reset email:', error);
      return next(new Error('There was an error sending the email. Please try again later.'));
    }
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`, { error });
    
    // Reset token and expiry if there was an error
    if (req.user) {
      req.user.passwordResetToken = undefined;
      req.user.passwordResetExpires = undefined;
      await req.user.save({ validateBeforeSave: false });
    }
    
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   PATCH /api/v1/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user by token and check if it's not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired',
        code: ERROR_CODES.AUTH_TOKEN_EXPIRED
      });
    }
    
    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now() - 1000; // Ensure token is created after password change
    
    await user.save();
    
    // Send password reset confirmation email
    try {
      await emailService.sendPasswordResetConfirmation(
        user.email,
        user.name,
        new Date()
      );
    } catch (error) {
      logger.error('Error sending password reset confirmation email:', error);
      // Don't fail the request if email sending fails
    }
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.'
    });
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Verify email
 * @route   GET /api/v1/auth/verify-email/:token
 * @access  Public
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // Find user by verification token
    const user = await User.findOne({ emailVerificationToken: token });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
        code: ERROR_CODES.AUTH_TOKEN_EXPIRED
      });
    }
    
    // Update user
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    
    // Send welcome email after successful verification
    try {
      await emailService.sendWelcomeEmail(
        user.email,
        user.name,
        null // No verification URL needed since email is already verified
      );
    } catch (error) {
      logger.error('Error sending welcome email after verification:', error);
      // Don't fail the request if email sending fails
    }
    
    // If this is an API request, return JSON
    if (req.accepts('json')) {
      return res.status(200).json({
        success: true,
        message: 'Email verified successfully. You can now log in.'
      });
    }
    
    // If this is a browser request, redirect to login page with success message
    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch (error) {
    logger.error(`Email verification error: ${error.message}`, { error });
    
    // If this is a browser request, redirect to login page with error message
    if (!req.accepts('json')) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=verification_failed`);
    }
    
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Update user details
 * @route   PUT /api/v1/auth/update-details
 * @access  Private
 */
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      bio: req.body.bio,
      avatar: req.body.avatar
    };
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error(`Update user details error: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/v1/auth/update-password
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS
      });
    }
    
    // Update password
    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now() - 1000; // Ensure token is created after password change
    await user.save();
    
    // Send password change notification email
    await sendEmail({
      to: user.email,
      subject: 'Password Changed',
      template: 'password-changed',
      context: {
        name: user.name,
        date: new Date().toLocaleDateString(),
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });
    
    // Generate new tokens
    const { accessToken, refreshToken } = createTokens(user);
    
    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    // Set new tokens in response headers
    res.setHeader('x-access-token', accessToken);
    res.setHeader('x-refresh-token', refreshToken);
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error(`Update password error: ${error.message}`, { error });
    next(error);
  }
};
