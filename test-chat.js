const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:3000/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Привет' }] })
  });
  
  if (!res.ok) {
    console.error('HTTP Error:', res.status);
    console.error(await res.text());
    return;
  }
  
  const text = await res.text();
  console.log('RESPONSE:', text);
}
test();
