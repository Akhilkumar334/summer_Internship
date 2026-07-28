const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const Job = require('../models/Job');
// Helper function to sign JWT token
const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_key_change_this_in_production_12345',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Signup Controller
const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate inputs
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Please provide all required fields: username, email, password, role' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      return res.status(400).json({ error: `${field} already registered` });
    }

    // Create user
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role
    });

    // Generate token
    const token = signToken(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error occurred during registration' });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Please provide email/username and password' });
    }

    // Find user by either email or username (explicitly select password field)
    const user = await User.scope('withPassword').findOne({
      where: {
        [Op.or]: [
          { email: emailOrUsername.toLowerCase() },
          { username: emailOrUsername.toLowerCase() }
        ]
      }
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Incorrect email/username or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'This account has been deactivated.' });
    }

    // Generate token
    const token = signToken(user.id);

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error occurred during login' });
  }
};

// Get Currently Logged In User Controller
const getMe = async (req, res) => {
  try {
    // req.user was set by the protect middleware
    res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

// Change Password Controller
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide current and new password' });
    }

    // Must fetch user with password scope to compare
    const user = await User.scope('withPassword').findByPk(req.user.id);
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error updating password' });
  }
};

// Delete Account (Soft Delete) Controller
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Perform soft delete
    user.isActive = false;
    await user.save();

    // If employer, close their jobs
    if (user.role === 'employer') {
      await Job.update(
        { status: 'closed' },
        { where: { employerId: user.id } }
      );
    }

    res.status(200).json({ message: 'Account has been deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error deactivating account' });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  changePassword,
  deleteAccount
};
