const { Op } = require('sequelize');
const Job = require('../models/Job');
const User = require('../models/User');
const EmployerProfile = require('../models/EmployerProfile');

// Create a new Job Listing
const createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, salary, jobType } = req.body;
    const employerId = req.user.id;

    if (!title || !description || !requirements || !location) {
      return res.status(400).json({ error: 'Please provide title, description, requirements, and location' });
    }

    const job = await Job.create({
      employerId,
      title,
      description,
      requirements,
      location,
      salary,
      jobType
    });

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error creating job listing' });
  }
};

// Retrieve all Job Listings (with optional filters)
const getAllJobs = async (req, res) => {
  try {
    const { title, location, jobType } = req.query;
    const whereClause = { status: 'open' };

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` };
    }
    if (location) {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }
    if (jobType) {
      whereClause.jobType = jobType;
    }

    const jobs = await Job.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['id', 'username', 'email'],
          where: { isActive: true },
          include: [
            {
              model: EmployerProfile,
              as: 'employerProfile'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error fetching jobs' });
  }
};

// Retrieve a single Job Listing details
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id, {
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
    });

    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }

    res.status(200).json({ job });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error fetching job details' });
  }
};

// Update a Job Listing (Owner only)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, requirements, location, salary, jobType } = req.body;
    const employerId = req.user.id;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }

    // Verify ownership
    if (job.employerId !== employerId) {
      return res.status(403).json({ error: 'You are not authorized to update this job listing' });
    }

    await job.update({
      title: title || job.title,
      description: description || job.description,
      requirements: requirements || job.requirements,
      location: location || job.location,
      salary: salary !== undefined ? salary : job.salary,
      jobType: jobType || job.jobType
    });

    res.status(200).json({
      message: 'Job listing updated successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error updating job listing' });
  }
};

// Delete a Job Listing (Owner only)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employerId = req.user.id;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }

    // Verify ownership
    if (job.employerId !== employerId) {
      return res.status(403).json({ error: 'You are not authorized to delete this job listing' });
    }

    await job.destroy();

    res.status(200).json({ message: 'Job listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error deleting job listing' });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
};
