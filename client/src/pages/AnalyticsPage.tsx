import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import type { AnalyticsOverview } from '../types';
import { BarChart3 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.getAnalyticsOverview();
        setData(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div className="text-slate-400 p-8">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-rose-500" />
        <h1 className="text-2xl font-bold text-slate-100">Analytics Deep Dive</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-200 mb-4">Risk Distribution</h2>
        <div className="flex gap-4">
          {data.riskDistribution.map(dist => (
            <div key={dist.level} className="flex-1 bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">{dist.level}</div>
              <div className="text-2xl font-bold text-slate-200">{dist.count}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-200 mb-4">Alert Severities</h2>
        <div className="flex flex-wrap gap-4">
          {data.alertCounts.map(alert => (
            <div key={alert.severity} className="min-w-[150px] flex-1 bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="text-sm text-slate-400 mb-1">{alert.severity}</div>
              <div className="text-2xl font-bold text-slate-200">{alert.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
