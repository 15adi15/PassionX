const mongoose = require('mongoose');

// Helper regex for standard email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate User Registration Payload
 */
const validateRegister = (req, res, next) => {
  const { name, email, password, passions, location } = req.body;
  const errors = {};

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  } else if (name.trim().length > 50) {
    errors.name = 'Name cannot exceed 50 characters.';
  }

  // Email validation
  if (!email || typeof email !== 'string') {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address (e.g. user@example.com).';
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  } else if (password.length > 128) {
    errors.password = 'Password cannot exceed 128 characters.';
  }

  // Passions validation (optional during registration, but must be valid if provided)
  if (passions !== undefined) {
    if (!Array.isArray(passions) && typeof passions !== 'string') {
      errors.passions = 'Passions must be an array or comma-separated string.';
    } else if (Array.isArray(passions) && passions.length > 15) {
      errors.passions = 'You can list up to 15 passions.';
    }
  }

  // Location validation (optional)
  if (location && typeof location === 'object') {
    if (location.city && (typeof location.city !== 'string' || location.city.length > 60)) {
      errors.city = 'City name cannot exceed 60 characters.';
    }
    if (location.state && (typeof location.state !== 'string' || location.state.length > 60)) {
      errors.state = 'State name cannot exceed 60 characters.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted fields.',
      errors,
    });
  }

  // Sanitize trimmed values
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

/**
 * Validate User Login Payload
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid login details.',
      errors,
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

/**
 * Validate Profile Update Payload
 */
const validateProfileUpdate = (req, res, next) => {
  const { name, bio, aboutMe, lookingFor, passions, interests, location, avatar } = req.body;
  const errors = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (name.trim().length > 50) {
      errors.name = 'Name cannot exceed 50 characters.';
    }
  }

  if (bio !== undefined && typeof bio === 'string' && bio.length > 300) {
    errors.bio = 'Bio cannot exceed 300 characters.';
  }

  if (aboutMe !== undefined && typeof aboutMe === 'string' && aboutMe.length > 1500) {
    errors.aboutMe = 'About Me cannot exceed 1,500 characters.';
  }

  if (lookingFor !== undefined && typeof lookingFor === 'string' && lookingFor.length > 800) {
    errors.lookingFor = "What I'm Looking For cannot exceed 800 characters.";
  }

  if (passions !== undefined) {
    if (!Array.isArray(passions)) {
      errors.passions = 'Passions must be an array of strings.';
    } else if (passions.length > 15) {
      errors.passions = 'Maximum 15 passions allowed.';
    }
  }

  if (interests !== undefined) {
    if (!Array.isArray(interests)) {
      errors.interests = 'Interests must be an array of strings.';
    } else if (interests.length > 25) {
      errors.interests = 'Maximum 25 interests allowed.';
    }
  }

  if (avatar !== undefined && typeof avatar === 'string') {
    // Validate that it's a URL or base64 data URL
    if (avatar.length > 5000000) {
      errors.avatar = 'Avatar image payload is too large (max 5MB).';
    }
  }

  if (location && typeof location === 'object') {
    if (location.city && (typeof location.city !== 'string' || location.city.length > 60)) {
      errors.city = 'City name cannot exceed 60 characters.';
    }
    if (location.state && (typeof location.state !== 'string' || location.state.length > 60)) {
      errors.state = 'State name cannot exceed 60 characters.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Profile update validation failed.',
      errors,
    });
  }

  next();
};

/**
 * Validate MongoDB ObjectId in URL params (e.g. /:id)
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID parameter format (${paramName}): must be a 24-character hexadecimal string.`,
      });
    }
    next();
  };
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateObjectId,
};
