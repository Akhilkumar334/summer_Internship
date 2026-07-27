const fs = require('fs');
const path = require('path');
const CandidateProfile = require('../models/CandidateProfile');
const EmployerProfile = require('../models/EmployerProfile');
const uploadResume = require('../middleware/uploadMiddleware');

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let profile = null;

    if (role === 'candidate') {
      profile = await CandidateProfile.findOne({ where: { userId } });
    } else if (role === 'employer') {
      profile = await EmployerProfile.findOne({ where: { userId } });
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please set up your profile.' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error fetching profile' });
  }
};

// Create or Update profile
const updateProfile = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;

  if (role === 'candidate') {
    // Handle file upload and parsing
    uploadResume(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      try {
        const {
          name,
          contact,
          highestQualification,
          degree,
          college,
          gradYear,
          skills,
          interests,
          experience
        } = req.body;

        // Check required fields
        if (!name || !contact || !highestQualification || !degree || !college || !gradYear || !skills || !interests) {
          // If a file was uploaded but validation failed, clean it up
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({ error: 'Please provide all required profile fields' });
        }

        // Find existing profile
        let profile = await CandidateProfile.findOne({ where: { userId } });

        let resumePath = profile ? profile.resumePath : null;
        let resumeName = profile ? profile.resumeName : null;

        // If a new resume is uploaded, delete the old one
        if (req.file) {
          if (profile && profile.resumePath) {
            try {
              if (fs.existsSync(profile.resumePath)) {
                fs.unlinkSync(profile.resumePath);
              }
            } catch (unlinkErr) {
              console.error('Failed to delete old resume:', unlinkErr);
            }
          }
          resumePath = req.file.path;
          resumeName = req.file.originalname;
        }

        const profileData = {
          userId,
          name,
          contact,
          highestQualification,
          degree,
          college,
          gradYear: parseInt(gradYear, 10),
          skills,
          interests,
          experience,
          resumePath,
          resumeName
        };

        if (profile) {
          await profile.update(profileData);
        } else {
          profile = await CandidateProfile.create(profileData);
        }

        res.status(200).json({
          message: 'Profile updated successfully',
          profile
        });
      } catch (error) {
        // Cleanup uploaded file on unexpected errors
        if (req.file) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (cleanupErr) {
            console.error('Failed to cleanup uploaded file:', cleanupErr);
          }
        }
        res.status(500).json({ error: error.message || 'Error updating candidate profile' });
      }
    });
  } else if (role === 'employer') {
    try {
      const {
        name,
        designation,
        companyName,
        companyDescription,
        companyWebsite,
        companyLocation,
        contact
      } = req.body;

      if (!name || !designation || !companyName || !companyDescription || !companyLocation || !contact) {
        return res.status(400).json({ error: 'Please provide all required profile fields' });
      }

      let profile = await EmployerProfile.findOne({ where: { userId } });

      const profileData = {
        userId,
        name,
        designation,
        companyName,
        companyDescription,
        companyWebsite,
        companyLocation,
        contact
      };

      if (profile) {
        await profile.update(profileData);
      } else {
        profile = await EmployerProfile.create(profileData);
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        profile
      });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error updating employer profile' });
    }
  }
};

module.exports = {
  getProfile,
  updateProfile
};
