import { supabaseAdmin } from './supabase.js';
import { AnalyticsOverview } from '../types/riskguard.js';

export class AnalyticsService {
  static async getOverview(): Promise<AnalyticsOverview> {
    // In a production app, these would be complex aggregation queries.
    // For this prototype, we'll fetch some raw counts and calculate.

    const { count: totalTransactions } = await supabaseAdmin.from('transactions').select('*', { count: 'exact', head: true });
    const { count: highRiskTransactions } = await supabaseAdmin.from('transactions').select('*', { count: 'exact', head: true }).eq('risk_level', 'HIGH');
    
    const { data: highRiskData } = await supabaseAdmin.from('transactions').select('amount').eq('risk_level', 'HIGH').eq('status', 'DECLINED');
    const potentialLossPrevented = highRiskData ? highRiskData.reduce((acc, curr) => acc + Number(curr.amount), 0) : 0;
    
    const { count: alertsCount } = await supabaseAdmin.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE');
    
    // Hardcoded distributions for the prototype if DB is mostly empty, otherwise we'd aggregate
    return {
      totalTransactions: totalTransactions || 0,
      highRiskTransactions: highRiskTransactions || 0,
      fraudDetected: highRiskTransactions || 0,
      potentialLossPrevented,
      riskDistribution: [
        { level: 'LOW', count: (totalTransactions || 0) - (highRiskTransactions || 0) },
        { level: 'MEDIUM', count: Math.floor((totalTransactions || 0) * 0.1) },
        { level: 'HIGH', count: highRiskTransactions || 0 }
      ],
      suspiciousTrends: [
        { name: 'Multiple IPs', count: 12 },
        { name: 'Velocity Spike', count: 8 },
        { name: 'New Device', count: 24 }
      ],
      alertCounts: [
        { severity: 'CRITICAL', count: Math.floor((alertsCount || 0) * 0.2) },
        { severity: 'HIGH', count: Math.floor((alertsCount || 0) * 0.5) },
        { severity: 'MEDIUM', count: Math.floor((alertsCount || 0) * 0.3) },
        { severity: 'LOW', count: 0 }
      ],
      isPrototype: true
    };
  }
}
