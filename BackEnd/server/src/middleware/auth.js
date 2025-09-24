const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const { verifyToken } = require('../utils/tokenUtils');
const { TOKEN_TYPES, USER_ROLES } = require('../config/constants');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');

// Promisify JWT verify
const verifyJwt = promisify(jwt.verify);

// Middleware to verify JWT token with refresh functionality
const authenticate = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE START ===');

    // 1) Get tokens from headers
    let accessToken;
    let refreshToken;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      accessToken = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    } else if (req.cookies.jwt) {
      accessToken = req.cookies.jwt;
      console.log('Token found in cookies');
    } else if (req.headers['x-access-token']) {
      accessToken = req.headers['x-access-token'];
      console.log('Token found in x-access-token header');
    }

    console.log('Access token present:', !!accessToken);
    console.log('Access token length:', accessToken ? accessToken.length : 0);

    // 2) Check if tokens exist
    if (!accessToken) {
      console.log('=== NO ACCESS TOKEN FOUND ===');
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401, 'AUTH_REQUIRED')
      );
    }

    // 3) Verify access token
    let decoded;
    try {
      decoded = await verifyJwt(accessToken, process.env.JWT_ACCESS_SECRET);
      console.log('Access token verified successfully');
    } catch (error) {
      console.log('Access token verification failed:', error.message);
      
      // If access token is invalid, try to use refresh token
      if (refreshToken) {
        try {
          const refreshDecoded = await verifyJwt(refreshToken, process.env.JWT_REFRESH_SECRET);
          console.log('Refresh token verified, generating new access token');
          
          // Generate new access token
          const newAccessToken = jwt.sign(
            { id: refreshDecoded.id, email: refreshDecoded.email, role: refreshDecoded.role },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
          );
          
          // Set new token in response header
          res.setHeader('X-New-Token', newAccessToken);
          decoded = refreshDecoded;
        } catch (refreshError) {
          console.log('Refresh token verification failed:', refreshError.message);
          return next(
            new AppError('Authentication failed. Please log in again.', 401, 'AUTH_FAILED')
          );
        }
      } else {
        return next(
          new AppError('Authentication failed. Please log in again.', 401, 'AUTH_FAILED')
        );
      }
    }

    // 4) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.log('User not found in database');
      return next(
        new AppError('The user belonging to this token no longer exists.', 401, 'USER_NOT_FOUND')
      );
    }

    // 5) Check if user account is active
    if (!currentUser.active) {
      console.log('User account is deactivated');
      return next(
        new AppError('Your account has been deactivated. Please contact support.', 401, 'ACCOUNT_DEACTIVATED')
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    console.log('Authentication successful for user:', currentUser.email);
    req.user = currentUser;
    res.locals.user = currentUser;
    next();

  } catch (error) {
    console.error(`Auth middleware error: ${error.message}`, { error });
    return res.status(401).json({ message: 'Not authorized, authentication failed' });
  }
};

// Middleware to verify Firebase token
exports.authenticateFirebase = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
    
    // Find or create user based on Firebase UID
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      user = new User({
        name: decodedToken.name || 'Firebase User',
        email: decodedToken.email,
        firebaseUid: decodedToken.uid,
        photoURL: decodedToken.picture || '',
        authProvider: 'google'
      });
      await user.save();
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Firebase auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized, firebase token failed' });
  }
};

// Middleware to restrict access to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'faculty']. role='student'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403, 'FORBIDDEN')
      );
    }
    next();
  };
};

// Convenience middleware for common roles
const isAdmin = restrictTo(USER_ROLES.ADMIN);
const isFaculty = restrictTo(USER_ROLES.FACULTY, USER_ROLES.ADMIN);
const isStudent = restrictTo(USER_ROLES.STUDENT);

// Middleware to check if user is logged in, for rendered pages, no errors!
const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1) Verify token
      const decoded = await verifyJwt(req.cookies.jwt, process.env.JWT_ACCESS_SECRET);

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.user.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // 4) Check if user account is active
      if (!currentUser.active) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    // If there's an error, just continue to the next middleware
    return next();
  }
  next();
};

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401, 'AUTH_REQUIRED')
      );
    }

    // 2) Verification token
    const decoded = await verifyJwt(token, process.env.JWT_ACCESS_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.user.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401, 'USER_NOT_FOUND')
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401, 'PASSWORD_CHANGED')
      );
    }

    // 5) Check if user account is active
    if (!currentUser.active) {
      return next(
        new AppError('Your account has been deactivated. Please contact support.', 401, 'ACCOUNT_DEACTIVATED')
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
  protect,
  restrictTo,
  isAdmin,
  isFaculty,
  isStudent,
  isLoggedIn
};