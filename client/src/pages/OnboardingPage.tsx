import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Sparkles, GraduationCap, Briefcase, Award, Clock } from 'lucide-react';
import { ProfileSchema } from '../validation/index';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { fetchApi } from '../lib/api';
import { ErrorAlert } from '../components/ErrorAlert';

type ProfileFormData = z.infer<typeof ProfileSchema>;

export const OnboardingPage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      known_technologies: profile?.known_technologies || ['React', 'JavaScript', 'HTML/CSS'],
      weak_technologies: profile?.weak_technologies || ['System Design', 'SQL Optimization'],
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
    try {
      await fetchApi('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <Bot className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Set Up Your Career Profile</h1>
          <p className="text-xs text-slate-400">
            Tell Gemini AI about your target role and goals so it can tailor your mock interview questions.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          {errorMsg && <ErrorAlert message={errorMsg} />}

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
                    placeholder="e.g. Stanford University"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Target Role & Preferred Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Engineering Role</label>
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
                    <option value="Easy">Easy (Fundamentals & Core Syntax)</option>
                    <option value="Medium">Medium (Practical Implementation & Logic)</option>
                    <option value="Hard">Hard (Deep Optimization & Edge Cases)</option>
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
                <option value={60}>60 Minutes / day (Recommended)</option>
                <option value={90}>90 Minutes / day</option>
                <option value={120}>120 Minutes / day (Intensive Prep)</option>
              </select>
            </div>

            {/* Known Technologies */}
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

            {/* Weak Technologies */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Topics You Want to Improve (Gemini AI will focus here)
              </label>
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
              <Sparkles className="w-4 h-4" /> Save Profile & Launch Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
