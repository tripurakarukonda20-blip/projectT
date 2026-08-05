import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, User, Mail, Lock, Sparkles } from 'lucide-react';
import { RegisterSchema } from '../validation/index';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { ErrorAlert } from '../components/ErrorAlert';

type RegisterFormData = z.infer<typeof RegisterSchema>;

export const RegisterPage: React.FC = () => {
  const { signUp, enableDemoMode } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg(null);
    try {
      await signUp(data.email, data.password, data.full_name);
      navigate('/onboarding');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  const handleQuickDemo = () => {
    enableDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Bot className="w-7 h-7 text-white" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
        <p className="text-xs text-slate-400">Join CareerPilot AI and start preparing for your technical interviews</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          {errorMsg && <ErrorAlert message={errorMsg} />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  {...register('full_name')}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
              {errors.full_name && <p className="text-xs text-rose-400 mt-1">{errors.full_name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="alex@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
              {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
            <button
              onClick={handleQuickDemo}
              type="button"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" /> Instant Demo Mode (No Registration)
            </button>

            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
