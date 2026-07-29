const { Op } = require('sequelize');
const Job = require('../models/Job');
const User = require('../models/User');
const EmployerProfile = require('../models/EmployerProfile');
const CandidateProfile = require('../models/CandidateProfile');

// Calculate cosine similarity match score with double-weighted required skills
const calculateMatchPercentage = (candidateSkillsStr, requiredSkillsStr, niceToHaveSkillsStr) => {
  const reqStr = requiredSkillsStr || '';
  if (!reqStr.trim()) return 0;
  
  const candidateSkills = (candidateSkillsStr || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
    
  if (candidateSkills.length === 0) return 0;
  
  const candidateSet = new Set(candidateSkills);
  
  const requiredSkills = reqStr
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
    
  const niceToHaveSkills = (niceToHaveSkillsStr || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
    
  if (requiredSkills.length === 0 && niceToHaveSkills.length === 0) return 0;
  
  const requiredIntersect = requiredSkills.filter(s => candidateSet.has(s));
  const niceIntersect = niceToHaveSkills.filter(s => candidateSet.has(s));
  
  // Sim = sqrt((4*|R intersect C| + |N intersect C|) / (4*|R| + |N|))
  const matchDotProduct = (requiredIntersect.length * 4) + (niceIntersect.length * 1);
  const totalWeightSq = (requiredSkills.length * 4) + (niceToHaveSkills.length * 1);
  
  if (totalWeightSq === 0) return 0;
  
  const matchFraction = matchDotProduct / totalWeightSq;
  const similarity = Math.sqrt(matchFraction);
  
  return Math.round(similarity * 100);
};

// Create a new Job Listing
const createJob = async (req, res) => {
  try {
    const { 
      title, description, requirements, requiredSkills, niceToHaveSkills, location, salary, jobType,
      openings, deadline, experienceRequired, responsibilities, preferredQualifications, benefits, selectionProcess, additionalRequirements
    } = req.body;
    const employerId = req.user.id;

    const finalRequiredSkills = requiredSkills || requirements || '';
    const finalNiceToHaveSkills = niceToHaveSkills || '';

    if (!title || !description || !finalRequiredSkills || !location) {
      return res.status(400).json({ error: 'Please provide title, description, requirements, and location' });
    }

    const job = await Job.create({
      employerId,
      title,
      description,
      requirements: finalRequiredSkills,
      requiredSkills: finalRequiredSkills,
      niceToHaveSkills: finalNiceToHaveSkills,
      location,
      salary,
      jobType,
      openings,
      deadline,
      experienceRequired,
      responsibilities,
      preferredQualifications,
      benefits,
      selectionProcess,
      additionalRequirements
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
              as: 'employerProfile',
              required: false
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Fetch candidate skills if logged in
    let candidateSkillsStr = '';
    if (req.user && req.user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({ where: { userId: req.user.id } });
      if (profile) {
        candidateSkillsStr = profile.parsedSkills || profile.skills || '';
      }
    }

    const jobsWithScores = jobs.map(job => {
      const jobJson = job.toJSON();
      if (req.user && req.user.role === 'candidate') {
        jobJson.matchPercentage = calculateMatchPercentage(
          candidateSkillsStr,
          job.requiredSkills || job.requirements || '',
          job.niceToHaveSkills || ''
        );
      } else {
        jobJson.matchPercentage = null;
      }
      return jobJson;
    });

    res.status(200).json({ jobs: jobsWithScores });
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

    const jobJson = job.toJSON();
    if (req.user && req.user.role === 'candidate') {
      let candidateSkillsStr = '';
      const profile = await CandidateProfile.findOne({ where: { userId: req.user.id } });
      if (profile) {
        candidateSkillsStr = profile.parsedSkills || profile.skills || '';
      }
      jobJson.matchPercentage = calculateMatchPercentage(
        candidateSkillsStr,
        job.requiredSkills || job.requirements || '',
        job.niceToHaveSkills || ''
      );
    } else {
      jobJson.matchPercentage = null;
    }

    res.status(200).json({ job: jobJson });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error fetching job details' });
  }
};

// Update a Job Listing (Owner only)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, requirements, requiredSkills, niceToHaveSkills, location, salary, jobType,
      openings, deadline, experienceRequired, responsibilities, preferredQualifications, benefits, selectionProcess, additionalRequirements
    } = req.body;
    const employerId = req.user.id;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ error: 'Job listing not found' });
    }

    // Verify ownership
    if (job.employerId !== employerId) {
      return res.status(403).json({ error: 'You are not authorized to update this job listing' });
    }

    const finalRequiredSkills = requiredSkills !== undefined ? requiredSkills : job.requiredSkills;
    const finalNiceToHaveSkills = niceToHaveSkills !== undefined ? niceToHaveSkills : job.niceToHaveSkills;

    await job.update({
      title: title || job.title,
      description: description || job.description,
      requirements: finalRequiredSkills || job.requirements,
      requiredSkills: finalRequiredSkills,
      niceToHaveSkills: finalNiceToHaveSkills,
      location: location || job.location,
      salary: salary !== undefined ? salary : job.salary,
      jobType: jobType || job.jobType,
      openings: openings !== undefined ? openings : job.openings,
      deadline: deadline !== undefined ? deadline : job.deadline,
      experienceRequired: experienceRequired !== undefined ? experienceRequired : job.experienceRequired,
      responsibilities: responsibilities !== undefined ? responsibilities : job.responsibilities,
      preferredQualifications: preferredQualifications !== undefined ? preferredQualifications : job.preferredQualifications,
      benefits: benefits !== undefined ? benefits : job.benefits,
      selectionProcess: selectionProcess !== undefined ? selectionProcess : job.selectionProcess,
      additionalRequirements: additionalRequirements !== undefined ? additionalRequirements : job.additionalRequirements
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
