const http = require('http');

const data = JSON.stringify({
  cityFrom: 'test',
  workType: 'remote',
  skills: ['test'],
  interests: []
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/me/profile',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
