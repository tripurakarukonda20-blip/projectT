import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Play, Sparkles, Briefcase, HelpCircle, Layers, Gauge, ListOrdered } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { InterviewSetupSchema } from '../validation/index';
import { z } from 'zod';
import { fetchApi } from '../lib/api';
import { ErrorAlert } from '../components/ErrorAlert';
import { useAuth } from '../hooks/useAuth';

type InterviewSetupData = z.infer<typeof InterviewSetupSchema>;

export const InterviewSetupPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InterviewSetupData>({
    resolver: zodResolver(InterviewSetupSchema),
    defaultValues: {
      target_role: profile?.target_role || 'Full-Stack Developer',
      interview_type: 'Technical',
      topic: 'React',
      difficulty: (profile?.preferred_difficulty as any) || 'Medium',
      total_questions: 3,
    },
  });

  const selectedRole = watch('target_role');
  const selectedType = watch('interview_type');
  const selectedDifficulty = watch('difficulty');
  const selectedCount = watch('total_questions');

  const topicOptionsMap: Record<string, string[]> = {
    'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'API Integration', 'Browser Concepts', 'Web Performance', 'Accessibility'],
    'Backend Developer': ['Node.js', 'Express.js', 'REST APIs', 'Authentication', 'Authorization', 'SQL', 'PostgreSQL', 'Database Design', 'Security', 'Error Handling'],
    'Full-Stack Developer': ['React', 'Node.js', 'Express.js', 'APIs', 'Supabase', 'Authentication', 'Authorization', 'Database Relationships', 'Deployment', 'Git'],
  };

  const availableTopics = topicOptionsMap[selectedRole] || topicOptionsMap['Full-Stack Developer'];

  const onSubmit = async (data: InterviewSetupData) => {
    setErrorMsg(null);
    try {
      const response = await fetchApi<{ message: string; session: { id: string } }>('/api/interviews/start', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.session?.id) {
        navigate(`/interview/${response.session.id}`);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to start interview session');
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
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Interview Configuration
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Configure Your Mock Interview
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Select your target role, topic, and difficulty to generate custom questions via Gemini AI.
              </p>
            </div>

            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              {errorMsg && <ErrorAlert message={errorMsg} />}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                {/* Target Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-indigo-400" /> Target Role
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Frontend Developer', 'Backend Developer', 'Full-Stack Developer'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setValue('target_role', role);
                          setValue('topic', topicOptionsMap[role][0]);
                        }}
                        className={`p-3.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          selectedRole === role
                            ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500 shadow-md shadow-indigo-600/20'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" /> Interview Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Technical', 'HR', 'Mixed'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setValue('interview_type', type as any)}
                        className={`p-3.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          selectedType === type
                            ? 'bg-cyan-600/30 text-cyan-200 border-cyan-500 shadow-md shadow-cyan-600/20'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-purple-400" /> Primary Topic
                  </label>
                  <select
                    {...register('topic')}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-indigo-500 outline-none"
                  >
                    {availableTopics.map((tp) => (
                      <option key={tp} value={tp}>
                        {tp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-amber-400" /> Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Easy', 'Medium', 'Hard'].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setValue('difficulty', diff as any)}
                        className={`p-3.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          selectedDifficulty === diff
                            ? 'bg-amber-600/30 text-amber-200 border-amber-500 shadow-md shadow-amber-600/20'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-emerald-400" /> Number of Questions
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[3, 5, 10].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setValue('total_questions', cnt)}
                        className={`p-3.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          selectedCount === cnt
                            ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 shadow-md shadow-emerald-600/20'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {cnt} Questions
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" /> Start Live Mock Session
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
