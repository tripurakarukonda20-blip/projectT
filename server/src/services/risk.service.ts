import { RiskAssessment, RiskLevel, RiskFactor } from '../types/riskguard.js';

export interface RiskInputData {
  amount: number;
  is_new_device: boolean;
  velocity_24h: number;
  chargeback_count: number;
  refund_count: number;
  ip_risk: number;
  device_shared: number;
}

export class RiskService {
  static evaluateTransactionRisk(data: RiskInputData): RiskAssessment {
    let score = 0;
    const factors: RiskFactor[] = [];

    // 1. Amount Factor (Weight: up to 25)
    if (data.amount > 50000) {
      score += 25;
      factors.push({ name: 'High Amount', score: 25, description: `Amount ${data.amount} exceeds threshold.` });
    } else if (data.amount > 10000) {
      score += 10;
      factors.push({ name: 'Moderate Amount', score: 10, description: `Amount ${data.amount} is elevated.` });
    }

    // 2. Velocity Factor (Weight: up to 25)
    if (data.velocity_24h > 10) {
      score += 25;
      factors.push({ name: 'High Velocity', score: 25, description: `${data.velocity_24h} transactions in 24h.` });
    } else if (data.velocity_24h > 5) {
      score += 15;
      factors.push({ name: 'Moderate Velocity', score: 15, description: `${data.velocity_24h} transactions in 24h.` });
    }

    // 3. New Device Factor (Weight: 15)
    if (data.is_new_device) {
      score += 15;
      factors.push({ name: 'New Device', score: 15, description: 'First time transaction from this device.' });
    }

    // 4. IP Risk Factor (Weight: up to 20)
    if (data.ip_risk > 80) {
      score += 20;
      factors.push({ name: 'High IP Risk', score: 20, description: `IP is flagged with risk score ${data.ip_risk}.` });
    } else if (data.ip_risk > 50) {
      score += 10;
      factors.push({ name: 'Moderate IP Risk', score: 10, description: `IP is flagged with risk score ${data.ip_risk}.` });
    }

    // 5. Shared Device Factor (Weight: up to 15)
    if (data.device_shared > 3) {
      score += 15;
      factors.push({ name: 'Highly Shared Device', score: 15, description: `Device used by ${data.device_shared} accounts.` });
    }

    // 6. Chargeback History (Weight: Cap at 100 immediately)
    if (data.chargeback_count > 0) {
      score += 40;
      factors.push({ name: 'Prior Chargebacks', score: 40, description: `Customer has ${data.chargeback_count} prior chargebacks.` });
    }

    // Cap score at 100
    score = Math.min(score, 100);

    let level: RiskLevel = 'LOW';
    let explanation = 'Transaction appears normal.';
    let recommendedAction = 'Approve';

    if (score > 70) {
      level = 'HIGH';
      explanation = 'Multiple high-risk indicators detected. Strongly suggests fraudulent activity.';
      recommendedAction = 'Block and review immediately.';
    } else if (score > 30) {
      level = 'MEDIUM';
      explanation = 'Some anomalous behavior detected. Warrants closer inspection.';
      recommendedAction = 'Place on hold for manual review.';
    }

    return {
      score,
      level,
      factors,
      explanation,
      recommendedAction
    };
  }
}
