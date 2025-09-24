const http = require('http');

const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
const payload = Buffer.from(JSON.stringify({
  id: 'demo-user-id',
  email: 'demo@student.com',
  role: 'student',
  name: 'Demo Student',
  department: 'Computer Science',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
  demo: true
})).toString('base64');
const signature = 'demo-signature';
const token = `${header}.${payload}.${signature}`;

console.log('Testing with token:', token);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/analytics/overview',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});
req.end();
