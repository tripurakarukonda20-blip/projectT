import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CareerPilot AI Backend running on port ${PORT}`);
  console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
});
