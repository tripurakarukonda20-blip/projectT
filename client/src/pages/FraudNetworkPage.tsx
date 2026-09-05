import React, { useState } from 'react';
import { apiClient } from '../services/apiClient';
import type { FraudNetwork } from '../types';
import { Network, Search, Loader2 } from 'lucide-react';

export const FraudNetworkPage: React.FC = () => {
  const [entityId, setEntityId] = useState('');
  const [network, setNetwork] = useState<FraudNetwork | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityId.trim()) return;

    setLoading(true);
    try {
      const data = await apiClient.getFraudNetwork(entityId);
      setNetwork(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Network className="text-rose-500" />
            Fraud Network Map
          </h1>
          <p className="text-sm text-slate-400 mt-1">Visualize connections between suspicious entities.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="Entity ID..."
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-rose-500 text-slate-200"
          />
          <button
            type="submit"
            disabled={loading || !entityId.trim()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Map
          </button>
        </form>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center">
        {!network && !loading && (
          <div className="text-center text-slate-500">
            <Network className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Enter an entity ID to map its relationships.</p>
          </div>
        )}

        {loading && (
          <div className="text-center text-slate-500 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-rose-500" />
            <p>Analyzing network graph...</p>
          </div>
        )}

        {network && !loading && (
          <div className="absolute inset-0 p-8">
            <div className="absolute top-4 left-4 bg-slate-950/80 p-4 rounded-lg border border-slate-800 backdrop-blur-sm z-10">
              <h3 className="text-sm font-bold text-slate-200 mb-2">Network Summary</h3>
              <div className="space-y-1 text-xs text-slate-400">
                <p>Total Nodes: <span className="text-slate-200">{network.summary.totalEntities}</span></p>
                <p>Suspicious: <span className="text-rose-400">{network.summary.suspiciousEntities}</span></p>
                <p>Exposure: <span className="text-amber-400">${network.summary.potentialExposure.toLocaleString()}</span></p>
              </div>
            </div>
            
            {/* Simple static visualization of nodes for prototype since D3/Canvas is heavy to setup quickly */}
            <div className="w-full h-full flex flex-wrap content-center justify-center gap-8 p-12 overflow-auto">
              {network.nodes.map(node => (
                <div key={node.id} className={`p-4 rounded-xl border flex flex-col items-center gap-2 min-w-[120px] transition-transform hover:scale-105 cursor-pointer shadow-lg
                  ${node.risk === 'HIGH' ? 'bg-rose-950/30 border-rose-500/50 text-rose-200' :
                    node.risk === 'MEDIUM' ? 'bg-amber-950/30 border-amber-500/50 text-amber-200' :
                    'bg-slate-800/50 border-slate-700 text-slate-300'
                  }
                `}>
                  <div className="text-xs opacity-70">{node.type}</div>
                  <div className="font-mono text-sm font-bold text-center break-all">{node.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
