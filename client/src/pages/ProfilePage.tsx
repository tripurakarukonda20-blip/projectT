import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Briefcase, GraduationCap, Clock, Award, Save, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ProfileSchema } from '../validation/index';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { fetchApi } from '../lib/api';
import { ErrorAlert } from '../components/ErrorAlert';

type ProfileFormData = z.infer<typeof ProfileSchema>;

export const ProfilePage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      university: profile?.university || '',
      current_year: profile?.current_year || 'Final Year Student',
      target_role: profile?.target_role || 'Full-Stack Developer',
      experience_level: profile?.experience_level || 'Entry-Level / Student',
      preferred_difficulty: profile?.preferred_difficulty || 'Medium',
      known_technologies: profile?.known_technologies || ['React', 'JavaScript'],
      weak_technologies: profile?.weak_technologies || ['System Design', 'SQL'],
      daily_preparation_minutes: profile?.daily_preparation_minutes || 60,
    },
  });

  const knownTechs = watch('known_technologies') || [];
  const weakTechs = watch('weak_technologies') || [];

  const techOptions = [
    'HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js',
    'REST APIs', 'SQL', 'PostgreSQL', 'Supabase', 'System Design', 'Authentication',
    'Web Performance', 'Git & GitHub', 'Testing & CI/CD'
  ];

  const toggleKnownTech = (tech: string) => {
    if (knownTechs.includes(tech)) {
      setValue('known_technologies', knownTechs.filter(t => t !== tech));
    } else {
      setValue('known_technologies', [...knownTechs, tech]);
    }
  };

  const toggleWeakTech = (tech: string) => {
    if (weakTechs.includes(tech)) {
      setValue('weak_technologies', weakTechs.filter(t => t !== tech));
    } else {
      setValue('weak_technologies', [...weakTechs, tech]);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await fetchApi('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await refreshProfile();
      setSuccessMsg('Profile settings updated successfully!');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile settings');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Account Settings
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Profile & Goals Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Update your career target role, experience level, and preparation preferences.
              </p>
            </div>

            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              {errorMsg && <ErrorAlert message={errorMsg} />}
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                {/* Full Name & University */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      {...register('full_name')}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none"
                    />
                    {errors.full_name && <p className="text-xs text-rose-400 mt-1">{errors.full_name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">University / College</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        {...register('university')}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Role & Preferred Difficulty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <select
                        {...register('target_role')}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none"
                      >
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full-Stack Developer">Full-Stack Developer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Difficulty</label>
                    <div className="relative">
                      <Award className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <select
                        {...register('preferred_difficulty')}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Daily Prep Time */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Daily Preparation Time (Minutes)
                  </label>
                  <select
                    {...register('daily_preparation_minutes', { valueAsNumber: true })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none"
                  >
                    <option value={30}>30 Minutes / day</option>
                    <option value={60}>60 Minutes / day</option>
                    <option value={90}>90 Minutes / day</option>
                    <option value={120}>120 Minutes / day</option>
                  </select>
                </div>

                {/* Known Tech */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Technologies You Know</label>
                  <div className="flex flex-wrap gap-2">
                    {techOptions.map((tech) => {
                      const isSelected = knownTechs.includes(tech);
                      return (
                        <button
                          type="button"
                          key={tech}
                          onClick={() => toggleKnownTech(tech)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Weak Tech */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Weak Areas To Improve</label>
                  <div className="flex flex-wrap gap-2">
                    {techOptions.map((tech) => {
                      const isSelected = weakTechs.includes(tech);
                      return (
                        <button
                          type="button"
                          key={tech}
                          onClick={() => toggleWeakTech(tech)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Profile Changes
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
