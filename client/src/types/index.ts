export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'DECLINED' | 'HOLD' | 'REFUNDED';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';

export interface RiskFactor {
  name: string;
  score: number;
  description: string;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  explanation: string;
  recommendedAction: string;
}

export interface Transaction {
  id: string;
  customer_id: string | null;
  amount: number;
  currency: string;
  timestamp: string;
  merchant_id: string | null;
  device_id: string | null;
  ip_address: string | null;
  location: string | null;
  payment_method: string | null;
  is_new_device: boolean;
  previous_transactions: number;
  chargeback_count: number;
  refund_count: number;
  velocity_24h: number;
  ip_risk: number;
  device_shared: number;
  risk_score: number;
  risk_level: RiskLevel;
  status: TransactionStatus;
  risk_assessment?: RiskAssessment;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  joined_at: string;
  total_spent: number;
  fraud_flags: number;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: AlertSeverity;
  timestamp: string;
  description: string;
  affected_entity_id: string;
  entity_type: 'TRANSACTION' | 'CUSTOMER' | 'NETWORK';
  recommended_action: string | null;
  status: AlertStatus;
  created_at: string;
  updated_at: string;
}

export interface FraudNetworkNode {
  id: string;
  type: 'CUSTOMER' | 'DEVICE' | 'IP' | 'PAYMENT_METHOD' | 'LOCATION';
  label: string;
  risk: RiskLevel;
}

export interface FraudNetworkEdge {
  source: string;
  target: string;
  type: 'SHARES_DEVICE' | 'SHARES_IP' | 'TRANSACTED_FROM' | 'USES_METHOD';
}

export interface FraudNetwork {
  nodes: FraudNetworkNode[];
  links: FraudNetworkEdge[];
  summary: {
    totalEntities: number;
    suspiciousEntities: number;
    potentialExposure: number;
    riskLevel: RiskLevel;
  };
}

export interface InvestigationResult {
  summary: string;
  observedEvidence: string[];
  riskFactors: string[];
  relatedEntities: string[];
  calculatedRisk: RiskLevel;
  recommendation: string;
  confidence: number;
}

export interface AnalyticsOverview {
  totalTransactions: number;
  highRiskTransactions: number;
  fraudDetected: number;
  potentialLossPrevented: number;
  riskDistribution: { level: RiskLevel; count: number }[];
  suspiciousTrends: { name: string; count: number }[];
  alertCounts: { severity: AlertSeverity; count: number }[];
  isPrototype: boolean;
}

export interface SimulationResult {
  message: string;
  generatedTransactions: number;
  generatedAlerts: number;
  attackType: string;
}
