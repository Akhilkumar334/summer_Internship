const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const EmployerProfile = require('../models/EmployerProfile');

// Apply for a Job (Candidate only)
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const candidateId = req.user.id;

    if (!jobId) {
      return res.status(400).json({ error: 'Please provide a jobId' });
    }

    // 1. Verify Job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }

    // 2. Verify Candidate has a profile created
    const profile = await CandidateProfile.findOne({ where: { userId: candidateId } });
    if (!profile) {
      return res.status(400).json({ error: 'Please set up your profile and upload a resume before applying' });
    }

    // 3. Verify Candidate hasn't already applied to this job
    const existingApplication = await Application.findOne({
      where: { jobId, candidateId }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // 4. Create application
    const application = await Application.create({
      jobId,
      candidateId,
      coverLetter
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error submitting application' });
  }
};

// Get Candidate's own applications (Candidate only)
const getMyApplications = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const applications = await Application.findAll({
      where: { candidateId },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'employer',
              attributes: ['id', 'username', 'email'],
              include: [
                {
                  model: EmployerProfile,
                  as: 'employerProfile'
                }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error fetching your applications' });
  }
};

// Get applications for a specific job (Employer Owner only)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;

    // 1. Verify job exists and belongs to employer
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }

    if (job.employerId !== employerId) {
      return res.status(403).json({ error: 'You are not authorized to view applications for this job listing' });
    }

    // 2. Fetch applications
    const applications = await Application.findAll({
      where: { jobId },
      include: [
        {
          model: User,
          as: 'candidate',
          attributes: ['id', 'username', 'email'],
          include: [
            {
              model: CandidateProfile,
              as: 'candidateProfile'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error fetching applications for this job' });
  }
};

// Update application status (Employer Owner only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; // Application ID
    const { status } = req.body;
    const employerId = req.user.id;

    const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Please provide a valid status: ${validStatuses.join(', ')}` });
    }

    // Find application and include Job to verify ownership
    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job'
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify employer owns the job listing
    if (application.job.employerId !== employerId) {
      return res.status(403).json({ error: 'You are not authorized to update the status of this application' });
    }

    await application.update({ status });

    res.status(200).json({
      message: `Application status updated to ${status}`,
      application
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error updating application status' });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
};
