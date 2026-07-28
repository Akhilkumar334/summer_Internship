const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const EmployerProfile = sequelize.define('EmployerProfile', {
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
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  companyWebsite: {
    type: DataTypes.STRING,
    allowNull: true,
    set(val) {
      // Convert empty strings to null to avoid isUrl validation failures
      this.setDataValue('companyWebsite', val === '' ? null : val);
    },
    validate: {
      isUrl: true,
    },
  },
  companyLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = EmployerProfile;
