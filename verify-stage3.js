const http = require('http');

function request(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', error => reject(error));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function verifyFrontend() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:5173', res => {
      resolve({ status: res.statusCode });
    }).on('error', err => reject(err));
  });
}

async function runVerification() {
  console.log("--- Stage 3 Full Stack Verification ---");
  
  try {
    // 2. Frontend starts successfully
    process.stdout.write("Checking Frontend (localhost:5173)... ");
    const feRes = await verifyFrontend();
    if (feRes.status === 200) {
      console.log("OK (Status 200)");
    } else {
      console.log(`FAIL (Status ${feRes.status})`);
    }

    // 6. Fraud simulation works
    process.stdout.write("Testing Simulation Trigger (POST /api/simulation/fraud-attack)... ");
    const simRes = await request('/simulation/fraud-attack', 'POST');
    if (simRes.status === 200) {
      console.log("OK");
    } else {
      console.log(`FAIL (Status ${simRes.status})`);
      console.error(simRes.data);
    }

    // 4 & 5 & 7. Check Data & Analysis
    process.stdout.write("Fetching Transactions (GET /api/transactions)... ");
    const txRes = await request('/transactions');
    if (txRes.status === 200 && Array.isArray(txRes.data?.data) && txRes.data.data.length > 0) {
      console.log(`OK (Found ${txRes.data.data.length} transactions)`);
      const testTx = txRes.data.data[0];

      process.stdout.write(`Testing Investigation (POST /api/investigation) on TX: ${testTx.id}... `);
      const invRes = await request('/investigation', 'POST', { entityId: testTx.id, entityType: 'transaction' });
      if (invRes.status === 200) {
         console.log("OK (AI Report Generated)");
      } else {
         console.log(`FAIL (Status ${invRes.status})`);
         console.error(invRes.data);
      }
    } else {
      console.log("FAIL (No transactions found)");
      console.error(txRes.data);
    }

    // 5. Transaction risk analysis works
    process.stdout.write("Testing Risk Analyzer (POST /api/transactions/risk)... ");
    const riskRes = await request('/transactions/risk', 'POST', { amount: 50000, velocity24h: 3, ipRisk: 80 });
    if (riskRes.status === 200 && riskRes.data.score) {
      console.log(`OK (Score: ${riskRes.data.score}, Level: ${riskRes.data.level})`);
    } else {
      console.log(`FAIL (Status ${riskRes.status})`);
    }

    // 8. Simulation reset works
    process.stdout.write("Testing Simulation Reset (POST /api/simulation/reset)... ");
    const resetRes = await request('/simulation/reset', 'POST');
    if (resetRes.status === 200) {
      console.log("OK");
    } else {
      console.log(`FAIL (Status ${resetRes.status})`);
    }

    console.log("--- Verification Complete ---");
  } catch (err) {
    console.error("Critical Error during verification:", err);
  }
}

runVerification();
