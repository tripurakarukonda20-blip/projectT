const fs = require('fs');
const http = require('http');

function postJSON(path, data) {
  return new Promise((resolve, reject) => {
    const dataStr = data ? JSON.stringify(data) : '';
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataStr.length
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (dataStr) req.write(dataStr);
    req.end();
  });
}

function getJSON(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('\nStarting Final API Tests...');

  // 1. Reset any old simulation
  await postJSON('/api/simulation/reset', {});

  // 2. Trigger Simulation to create valid entities
  const simRes = await postJSON('/api/simulation/fraud-attack', {});
  console.log(`[Simulation API] Status: ${simRes.status}`);

  if (simRes.status === 200) {
    // 3. Fetch an alert to get a valid entityId
    const alertsRes = await getJSON('/api/alerts');
    const alerts = JSON.parse(alertsRes.body);
    
    if (alerts && alerts.length > 0) {
      const entityId = alerts[0].affected_entity_id;
      
      // 4. Test Investigation API with the valid entityId
      const invRes = await postJSON('/api/investigation', { entityId, entityType: 'customer' });
      console.log(`[Investigation API] Status: ${invRes.status}`);
      console.log(`[Investigation API] Response Snippet: ${invRes.body.substring(0, 150)}...`);
    } else {
      console.log('[Investigation API] Skipped: No alerts found to investigate');
    }
  }

  // 5. Clean up
  await postJSON('/api/simulation/reset', {});
  console.log('[Tests Complete]');
}

runTests();
