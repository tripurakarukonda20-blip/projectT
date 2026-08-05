import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, profile, signOut, isDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">CareerPilot</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Real-Time Interview Preparation</p>
          </div>
        </Link>

        {/* User Profile & Actions */}
        {user ? (
          <div className="flex items-center gap-4">
            {isDemoUser && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Demo Mode Active
              </span>
            )}
            <Link
              to="/profile"
              className="flex items-center gap-3.5 px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700/50"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-semibold text-sm">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-200">{profile?.full_name || user.email}</p>
                <p className="text-[10px] text-indigo-400 font-medium">{profile?.target_role || 'Student'}</p>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/20 transition-all duration-200"
            >
              Get Started Free
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
