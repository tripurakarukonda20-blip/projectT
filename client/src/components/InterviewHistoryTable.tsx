import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { InterviewSession } from '../types';

interface InterviewHistoryTableProps {
  sessions: InterviewSession[];
}

export const InterviewHistoryTable: React.FC<InterviewHistoryTableProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
        <p className="text-slate-400 text-sm">No mock interviews completed yet.</p>
        <Link
          to="/interview/new"
          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
        >
          Start Your First Interview
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl glass-card border border-slate-800">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/80 text-xs font-semibold uppercase text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Target Role & Topic</th>
            <th className="px-6 py-4">Difficulty</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Score</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {sessions.map((session) => {
            const isCompleted = session.status === 'completed';
            const dateStr = session.created_at
              ? new Date(session.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recently';

            return (
              <tr key={session.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">
                  <div className="font-bold text-sm text-slate-100">{session.target_role}</div>
                  <div className="text-xs text-indigo-400 font-medium">{session.topic} • ({session.interview_type})</div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      session.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : session.difficulty === 'Hard'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {session.difficulty}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                      <Clock className="w-3.5 h-3.5" /> In Progress
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 font-bold text-white">
                  {isCompleted && session.overall_score !== undefined ? (
                    <span className="flex items-center gap-1 text-slate-100">
                      <Award className="w-4 h-4 text-indigo-400" />
                      {session.overall_score}%
                    </span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>

                <td className="px-6 py-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {dateStr}
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  {isCompleted ? (
                    <Link
                      to={`/interview/${session.id}/result`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View Report <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      to={`/interview/${session.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Resume <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
