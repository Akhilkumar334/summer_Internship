const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  requirements: {
    type: DataTypes.TEXT, // comma-separated skills/requirements
    allowNull: false,
  },
  requiredSkills: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  niceToHaveSkills: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jobType: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship'),
    allowNull: false,
    defaultValue: 'Full-time',
  },
  openings: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  deadline: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experienceRequired: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preferredQualifications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  selectionProcess: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  additionalRequirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open',
  },
});

module.exports = Job;
