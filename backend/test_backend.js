require('dotenv').config();
const jwt = require('jsonwebtoken');
const http = require('http');

const token = jwt.sign({ id: 3 }, process.env.JWT_SECRET, { expiresIn: '1h' });

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/jobs/employer/my-jobs',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('RESPONSE:', data));
});

req.on('error', error => {
  console.error(error);
});

req.end();
