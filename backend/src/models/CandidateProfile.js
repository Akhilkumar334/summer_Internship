const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CandidateProfile = sequelize.define('CandidateProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  highestQualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  college: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gradYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  skills: {
    type: DataTypes.TEXT, // comma-separated skills
    allowNull: false,
  },
  interests: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resumePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resumeName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parsedSkills: {
    type: DataTypes.TEXT, // Comma-separated list of parsed skills
    allowNull: true,
  },
  parsedEducation: {
    type: DataTypes.TEXT, // JSON string of parsed education details
    allowNull: true,
  },
});

module.exports = CandidateProfile;
