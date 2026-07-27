const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getResume } = require('../controllers/profileController');

const router = express.Router();

// Public route for downloading resumes (so window.open works without JWT headers)
router.get('/resume/:filename', getResume);

// Protected routes (JWT authentication required)
router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

module.exports = router;
