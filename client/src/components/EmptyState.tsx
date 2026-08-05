import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon: Icon = Inbox,
}) => {
  return (
    <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
        <Icon className="w-7 h-7" />
      </div>
      <div className="max-w-sm space-y-1">
        <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
