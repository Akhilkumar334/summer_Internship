const express = require('express');
const { protect, restrictTo, optionalProtect } = require('../middleware/authMiddleware');
  createJob,
  getAllJobs,
  getMyEmployerJobs,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

const router = express.Router();

// Public routes (with optional authentication for matching scores)
router.get('/', optionalProtect, getAllJobs);
router.get('/:id', optionalProtect, getJobById);

// Protected routes (Employer only)
router.get('/employer/my-jobs', protect, restrictTo('employer'), getMyEmployerJobs);
router.post('/', protect, restrictTo('employer'), createJob);
router.put('/:id', protect, restrictTo('employer'), updateJob);
router.delete('/:id', protect, restrictTo('employer'), deleteJob);

module.exports = router;
