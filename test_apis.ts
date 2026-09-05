const runTests = async () => {
  const urls = [
    { name: 'Risk API', url: 'http://localhost:5000/api/transactions/risk', method: 'POST', body: { amount: 50000, is_new_device: true, velocity_24h: 5, chargeback_count: 0, refund_count: 0, ip_risk: 50, device_shared: 1 } },
    { name: 'Investigate API', url: 'http://localhost:5000/api/investigate', method: 'POST', body: { entityId: '123', entityType: 'customer' } },
    { name: 'Simulation API', url: 'http://localhost:5000/api/simulation/fraud-attack', method: 'POST' },
    { name: 'Simulation Reset API', url: 'http://localhost:5000/api/simulation/reset', method: 'POST' },
  ];

  for (const t of urls) {
    try {
      const res = await fetch(t.url, {
        method: t.method,
        headers: { 'Content-Type': 'application/json' },
        body: t.body ? JSON.stringify(t.body) : undefined
      });
      const data = await res.json();
      console.log(`[${t.name}] Status: ${res.status}, Response: ${JSON.stringify(data).substring(0, 100)}`);
    } catch (e: any) {
      console.log(`[${t.name}] Failed: ${e.message}`);
    }
  }
};
runTests();
