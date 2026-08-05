import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        <p className="text-xs sm:text-sm font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
};
