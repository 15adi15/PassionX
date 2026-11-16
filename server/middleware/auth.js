const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 1. AUTHENTICATION MIDDLEWARE (AuthN - "Who are you?")
 * Verifies the validity and signature of the JSON Web Token.
 * If missing, invalid, or expired, responds with HTTP 401 Unauthorized.
 */
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for presence of Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: 'Access denied: No token provided. Please authenticate by logging in.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify cryptographic signature of JWT using server secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;

    // Attach user role for subsequent authorization checks
    const user = await User.findById(decoded.id).select('role email name');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'The user account associated with this token no longer exists.',
      });
    }

    req.userRole = user.role || 'user';
    req.userData = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message:
        error.name === 'TokenExpiredError'
          ? 'Session expired: JWT token has expired. Please log in again.'
          : 'Invalid authentication token: Token signature verification failed.',
    });
  }
};

/**
 * 2. ROLE-BASED AUTHORIZATION MIDDLEWARE (AuthZ - "What permissions do you have?")
 * Verifies whether the authenticated user has the necessary role (e.g. 'admin').
 * If user lacks permission, responds with HTTP 403 Forbidden.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Authorization denied (Forbidden)',
        message: `Forbidden: Your account role ('${req.userRole || 'user'}') is not authorized to access this resource. Required role: [${roles.join(', ')}].`,
      });
    }
    next();
  };
};

/**
 * 3. RESOURCE OWNERSHIP AUTHORIZATION MIDDLEWARE (AuthZ)
 * Ensures a user is only authorized to modify or delete their own data.
 * If target ID doesn't match authenticated user ID (and user is not admin), returns HTTP 403 Forbidden.
 */
const authorizeOwnership = (paramName = 'id') => {
  return (req, res, next) => {
    const targetId = req.params[paramName];
    if (targetId && targetId !== req.user.toString() && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Authorization denied (Forbidden)',
        message: "Forbidden: You are only authorized to modify your own resources, not another user's.",
      });
    }
    next();
  };
};

/**
 * Optional Authentication (Passes through for guests, decodes for members)
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
  } catch (error) {
    req.user = null;
  }
  next();
};

module.exports = {
  auth,
  authorize,
  authorizeOwnership,
  optionalAuth,
};
