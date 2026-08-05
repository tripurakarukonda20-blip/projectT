import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'cyan';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      gradient: 'from-indigo-500/10 to-transparent',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500/10 to-transparent',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      gradient: 'from-amber-500/10 to-transparent',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      gradient: 'from-cyan-500/10 to-transparent',
    },
  };

  const currentTheme = colorMap[color];

  return (
    <div className={`p-5 rounded-2xl glass-card border ${currentTheme.border} relative overflow-hidden group hover:border-slate-700 transition-all duration-300`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${currentTheme.gradient} rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none`} />
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-white tracking-tight">{value}</span>
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
      )}
    </div>
  );
};
