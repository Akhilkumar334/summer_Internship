const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 255],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255],
    },
  },
  role: {
    type: DataTypes.ENUM('candidate', 'employer'),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: { }
    }
  }
});

// Compare password instance method
User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const CandidateProfile = require('./CandidateProfile');
const EmployerProfile = require('./EmployerProfile');
const Job = require('./Job');
const Application = require('./Application');

// Associations
User.hasOne(CandidateProfile, { foreignKey: 'userId', as: 'candidateProfile', onDelete: 'CASCADE' });
CandidateProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(EmployerProfile, { foreignKey: 'userId', as: 'employerProfile', onDelete: 'CASCADE' });
EmployerProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Job Associations
User.hasMany(Job, { foreignKey: 'employerId', as: 'jobs', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });

// Application Associations
User.hasMany(Application, { foreignKey: 'candidateId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'candidateId', as: 'candidate' });

Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

module.exports = User;
