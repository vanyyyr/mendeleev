const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai-chat',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  console.log('STATUS:', res.statusCode);
  res.on('data', d => console.log('DATA:', d.toString()));
});
req.write(JSON.stringify({ messages: [{role: 'user', content: 'привет'}] }));
req.end();
