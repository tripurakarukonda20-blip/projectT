import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading CareerPilot AI...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
      <p className="text-sm font-medium text-slate-300 animate-pulse">{message}</p>
    </div>
  );
};
