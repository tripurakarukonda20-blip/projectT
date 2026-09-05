import React, { useState } from 'react';
import { apiClient } from '../services/apiClient';
import type { InvestigationResult } from '../types';
import { Bot, Search, Loader2, ShieldAlert } from 'lucide-react';

export const InvestigatorPage: React.FC = () => {
  const [entityId, setEntityId] = useState('');
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInvestigate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // For demo, we just pass the ID as a customer search
      const data = await apiClient.investigateEntity(entityId, 'customer');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Investigation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 rounded-full mb-4">
          <Bot className="w-12 h-12 text-rose-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-100">AI Risk Investigator</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Powered by Gemini AI. Enter an entity ID (e.g. from an alert) to generate a deep-dive contextual analysis of their risk profile.
        </p>
      </div>

      <form onSubmit={handleInvestigate} className="relative">
        <input
          type="text"
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
          placeholder="Enter Customer ID, Transaction ID, or Alert ID..."
          className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl pl-6 pr-32 py-4 text-lg focus:outline-none focus:border-rose-500 text-slate-200 placeholder-slate-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !entityId.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-700 disabled:text-slate-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          Analyze
        </button>
      </form>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5" />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-100">AI Investigation Report</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
              result.calculatedRisk === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' :
              result.calculatedRisk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
            }`}>
              {result.calculatedRisk} RISK
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-slate-300 font-semibold mb-2">Summary</h3>
            <p className="text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
              {result.summary}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-slate-300 font-semibold mb-3">Key Risk Factors</h3>
              <ul className="space-y-2">
                {result.riskFactors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-rose-500 mt-1">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-slate-300 font-semibold mb-3">Recommendation</h3>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 text-rose-200/90 text-sm font-medium">
                {result.recommendation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
