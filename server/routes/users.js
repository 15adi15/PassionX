const express = require('express');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const { validateProfileUpdate, validateObjectId } = require('../middleware/validate');

const router = express.Router();

// @route   GET /api/users/discover
// @desc    Discover users (with optional filters)
router.get('/discover', optionalAuth, async (req, res) => {
  try {
    const { passion, city, state, search } = req.query;

    const filter = {};
    if (req.user) {
      filter._id = { $ne: req.user };
    }

    if (passion) {
      filter.passions = { $regex: passion, $options: 'i' };
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    if (state) {
      filter['location.state'] = { $regex: state, $options: 'i' };
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
router.get('/:id', auth, validateObjectId('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update own profile
router.put('/profile', auth, validateProfileUpdate, async (req, res) => {
  try {
    const { name, bio, aboutMe, lookingFor, passions, interests, location, avatar } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (aboutMe !== undefined) updateFields.aboutMe = aboutMe;
    if (lookingFor !== undefined) updateFields.lookingFor = lookingFor;
    if (passions !== undefined) updateFields.passions = passions;
    if (interests !== undefined) updateFields.interests = interests;
    if (location !== undefined) updateFields.location = location;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('connections', '-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/connect/:id
// @desc    Connect with a user (add to connections)
router.post('/connect/:id', auth, validateObjectId('id'), async (req, res) => {
  try {
    const targetUserId = req.params.id;
    if (targetUserId === req.user.toString()) {
      return res.status(400).json({ message: 'Cannot connect to yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add targetUser to current user's connections
    const user = await User.findByIdAndUpdate(
      req.user,
      { $addToSet: { connections: targetUserId } },
      { new: true }
    )
      .select('-password')
      .populate('connections', '-password');

    // Also add current user to targetUser's connections
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { connections: req.user },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users/disconnect/:id
// @desc    Remove connection
router.post('/disconnect/:id', auth, validateObjectId('id'), async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const user = await User.findByIdAndUpdate(
      req.user,
      { $pull: { connections: targetUserId } },
      { new: true }
    )
      .select('-password')
      .populate('connections', '-password');

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { connections: req.user },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/connections
// @desc    Get all connected users
router.get('/connections', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('connections', '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.connections || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
