import { Router } from 'express';
// We are temporarily removing requireAuth to allow easy prototype testing,
// but in a production app, it would wrap all these routes.
// import { requireAuth } from '../middleware/auth.js';

import { getTransactions, getTransactionById, processTransactionRisk } from '../controllers/transaction.controller.js';
import { getAlerts, getAlertById, updateAlertStatus } from '../controllers/alert.controller.js';
import { getFraudNetwork } from '../controllers/fraudNetwork.controller.js';
import { getAnalyticsOverview } from '../controllers/analytics.controller.js';
import { investigateEntity } from '../controllers/investigation.controller.js';
import { triggerFraudAttack, resetSimulation } from '../controllers/simulation.controller.js';

const router = Router();

// Transactions API
router.get('/transactions', getTransactions);
router.get('/transactions/:id', getTransactionById);
router.post('/transactions/risk', processTransactionRisk); // Evaluates a new transaction

// Alerts API
router.get('/alerts', getAlerts);
router.get('/alerts/:id', getAlertById);
router.patch('/alerts/:id', updateAlertStatus);

// Fraud Network API
router.get('/fraud-network/:entityId', getFraudNetwork);

// Analytics API
router.get('/analytics/overview', getAnalyticsOverview);

// AI Investigator API
router.post('/investigation', investigateEntity);

// Fraud Simulation API
router.post('/simulation/fraud-attack', triggerFraudAttack);
router.post('/simulation/reset', resetSimulation);

export default router;
