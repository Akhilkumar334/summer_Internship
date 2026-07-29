const { sequelize } = require('./backend/src/config/db');
const Job = require('./backend/src/models/Job');
const User = require('./backend/src/models/User');
const EmployerProfile = require('./backend/src/models/EmployerProfile');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    
    const employer = await User.findOne({ where: { role: 'employer' } });
    if (!employer) {
      console.log('No employer found');
      process.exit(0);
    }
    
    const employerId = employer.id;
    console.log('Testing with employerId:', employerId);
    
    const jobs = await Job.findAll({
      where: { employerId },
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['id', 'username', 'email'],
          include: [{
            model: EmployerProfile,
            as: 'employerProfile',
            attributes: ['companyName', 'companyWebsite', 'companyDescription']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`Success! Found ${jobs.length} jobs.`);
    process.exit(0);
  } catch (err) {
    console.error('Error in query:');
    console.error(err);
    process.exit(1);
  }
})();
