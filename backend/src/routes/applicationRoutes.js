const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getEmployerStats
} = require('../controllers/applicationController');

const router = express.Router();

// Apply all endpoints to be protected (requires login)
router.use(protect);

// Candidate routes
router.post('/', restrictTo('candidate'), applyForJob);
router.get('/my-applications', restrictTo('candidate'), getMyApplications);

// Employer routes
router.get('/stats', restrictTo('employer'), getEmployerStats);
router.get('/job/:jobId', restrictTo('employer'), getJobApplications);
router.put('/:id', restrictTo('employer'), updateApplicationStatus);

module.exports = router;
