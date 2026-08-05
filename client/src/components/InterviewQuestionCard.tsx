import React from 'react';
import { HelpCircle, Tag, Gauge, Code2 } from 'lucide-react';
import { InterviewQuestion } from '../types';

interface InterviewQuestionCardProps {
  question: InterviewQuestion;
  currentNumber: number;
  totalQuestions: number;
}

export const InterviewQuestionCard: React.FC<InterviewQuestionCardProps> = ({
  question,
  currentNumber,
  totalQuestions,
}) => {
  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const currentDifficultyStyle =
    difficultyColors[question.difficulty as keyof typeof difficultyColors] ||
    difficultyColors.Medium;

  return (
    <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 shadow-xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 font-extrabold text-xs border border-indigo-500/30">
            Question {currentNumber} of {totalQuestions}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            <Tag className="w-3 h-3 text-slate-400" />
            {question.topic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${currentDifficultyStyle}`}>
            <Gauge className="w-3 h-3" />
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Skill tested tag */}
      {question.skill_tested && (
        <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Skill Tested: <strong className="text-slate-300">{question.skill_tested}</strong></span>
        </div>
      )}

      {/* Question prompt text */}
      <div className="mt-2">
        <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed tracking-tight flex items-start gap-3">
          <HelpCircle className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
          <span>{question.question}</span>
        </h2>
      </div>
    </div>
  );
};
