import { Transaction, RiskAssessment, Alert, AnalyticsOverview, InvestigationResult, FraudNetwork } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || `API request failed with status ${response.status}`);
    }

    return data as T;
  } catch (error: any) {
    console.error(`API Client Error (${endpoint}):`, error);
    throw new Error(error.message || 'Network error occurred');
  }
}

export const apiClient = {
  // Analytics
  getAnalyticsOverview: () => fetchApi<AnalyticsOverview>('/analytics/overview'),

  // Transactions
  getTransactions: async () => {
    const res = await fetchApi<{data: Transaction[], count: number}>('/transactions');
    return res.data || [];
  },
  
  analyzeTransactionRisk: (data: any) => 
    fetchApi<RiskAssessment>('/transactions/risk', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Alerts
  getAlerts: () => fetchApi<Alert[]>('/alerts'),
  
  // Investigation
  investigateEntity: (entityId: string, entityType: 'transaction' | 'customer' | 'alert' | 'device' | 'ip') =>
    fetchApi<InvestigationResult>('/investigation', {
      method: 'POST',
      body: JSON.stringify({ entityId, entityType }),
    }),

  // Simulation
  triggerFraudSimulation: () => 
    fetchApi<{ message: string; generatedTransactions: number; generatedAlerts: number }>('/simulation/fraud-attack', {
      method: 'POST',
    }),
    
  resetSimulation: () =>
    fetchApi<{ message: string }>('/simulation/reset', {
      method: 'POST',
    }),

  // Fraud Network
  getFraudNetwork: (entityId: string) => fetchApi<FraudNetwork>(`/fraud-network/${entityId}`),
};
