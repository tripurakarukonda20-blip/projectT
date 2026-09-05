import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import type { AnalyticsOverview } from '../types';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await apiClient.getAnalyticsOverview();
      setData(result);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('simulation-updated', fetchData);
    return () => window.removeEventListener('simulation-updated', fetchData);
  }, []);

  if (loading || !data) {
    return <div className="text-slate-400 animate-pulse">Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Total Transactions', value: data.totalTransactions.toLocaleString(), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'High Risk Detected', value: data.highRiskTransactions.toLocaleString(), icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { label: 'Fraud Intercepted', value: data.fraudDetected.toLocaleString(), icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Loss Prevented (Est)', value: `$${data.potentialLossPrevented.toLocaleString()}`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Risk Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time fraud detection and transaction metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-100 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Risk Distribution Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 min-h-[400px]">
           <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Suspicious Trends</h3>
           <div className="space-y-4">
              {data.suspiciousTrends.length > 0 ? data.suspiciousTrends.map((trend, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <span className="text-slate-300 font-medium">{trend.name}</span>
                  <span className="text-rose-400 font-bold">{trend.count} flags</span>
                </div>
              )) : (
                <p className="text-slate-500 italic">No suspicious trends detected recently.</p>
              )}
           </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Risk Distribution</h3>
          <div className="space-y-4">
             {data.riskDistribution.map((dist, i) => (
               <div key={i} className="flex items-center justify-between">
                 <span className={`text-sm font-medium ${dist.level === 'HIGH' ? 'text-rose-400' : dist.level === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}`}>
                   {dist.level} RISK
                 </span>
                 <span className="text-slate-300">{dist.count}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
