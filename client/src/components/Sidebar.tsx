import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlayCircle,
  History,
  BookOpen,
  User,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/interview/new', label: 'Start Interview', icon: PlayCircle },
    { to: '/history', label: 'Interview History', icon: History },
    { to: '/study-plan', label: '7-Day Study Plan', icon: BookOpen },
    { to: '/profile', label: 'Profile & Goals', icon: User },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/60 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation</span>
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Preparation Tip Box */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-500/20 text-xs">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Pro Tip
        </div>
        <p className="text-slate-400 leading-relaxed">
          Structure technical answers with the STAR method (Situation, Task, Action, Result) for higher evaluation scores.
        </p>
      </div>
    </aside>
  );
};
