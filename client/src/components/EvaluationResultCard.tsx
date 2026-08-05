import React from 'react';
import { ScoreDisplay } from './ScoreDisplay';
import { FeedbackPanel } from './FeedbackPanel';
import { InterviewAnswer } from '../types';

interface EvaluationResultCardProps {
  answer: InterviewAnswer;
}

export const EvaluationResultCard: React.FC<EvaluationResultCardProps> = ({ answer }) => {
  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-6">
      {/* Top Header: Score & Result Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-5">
          <ScoreDisplay score={answer.score} maxScore={10} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-400">Answer Evaluation Result</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {answer.result || 'Evaluated'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              Score: {answer.score} / 10
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluated using Gemini Generative AI Model
            </p>
          </div>
        </div>
      </div>

      {/* Student Answer Submitted */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Your Submitted Answer
        </span>
        <p className="text-xs text-slate-300 italic leading-relaxed whitespace-pre-wrap">
          "{answer.student_answer}"
        </p>
      </div>

      {/* Detailed Feedback Panel */}
      <FeedbackPanel evaluation={answer} />
    </div>
  );
};
