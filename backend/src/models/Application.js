const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resumeType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'primary',
  },
  tailoredResumeName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Application;
