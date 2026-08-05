import React from 'react';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore = 10,
  label,
  size = 'md',
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  let colorClass = 'text-emerald-400 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  let badgeText = 'Excellent';

  if (percentage < 50) {
    colorClass = 'text-rose-400 stroke-rose-500 bg-rose-500/10 border-rose-500/30';
    badgeText = 'Needs Practice';
  } else if (percentage < 75) {
    colorClass = 'text-amber-400 stroke-amber-500 bg-amber-500/10 border-amber-500/30';
    badgeText = 'Good Effort';
  }

  const dimensions = size === 'lg' ? 120 : size === 'md' ? 88 : 64;
  const strokeWidth = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const radius = (dimensions - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={dimensions} height={dimensions} className="transform -rotate-90">
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className={`transition-all duration-1000 ease-out ${colorClass.split(' ')[0]}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span
            className={`font-extrabold text-white tracking-tight ${
              size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm'
            }`}
          >
            {score}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">/ {maxScore}</span>
        </div>
      </div>

      {label && (
        <div className="mt-2 text-center">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colorClass}`}>
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
};
