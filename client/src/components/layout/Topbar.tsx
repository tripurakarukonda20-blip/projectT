import React, { useState } from 'react';
import { Search, Bell, User, Zap, RefreshCw } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const Topbar: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await apiClient.triggerFraudSimulation();
      // Optionally trigger a global event so pages refresh their data
      window.dispatchEvent(new Event('simulation-updated'));
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await apiClient.resetSimulation();
      window.dispatchEvent(new Event('simulation-updated'));
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center flex-1">
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search transactions, entities, or alerts..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 text-slate-200 placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-sm font-medium rounded-lg border border-rose-500/20 transition-colors disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          {isSimulating ? 'Simulating...' : 'Simulate Fraud Attack'}
        </button>

        <button
          onClick={handleReset}
          disabled={isResetting}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          title="Reset Database"
        >
          <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
        </button>

        <div className="w-px h-6 bg-slate-800 mx-2" />

        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900" />
        </button>
        
        <button className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:border-slate-600 transition-colors">
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
