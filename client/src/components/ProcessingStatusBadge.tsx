import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Clock, FileCheck } from 'lucide-react';
import { ProcessingStatus } from '../types';

interface ProcessingStatusBadgeProps {
  status: ProcessingStatus;
}

export const ProcessingStatusBadge: React.FC<ProcessingStatusBadgeProps> = ({ status }) => {
  const configMap: Record<ProcessingStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode; animate?: boolean }> = {
    waiting: {
      label: 'Waiting for Input',
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700',
      icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
    },
    generating_question: {
      label: 'Gemini is drafting question...',
      bg: 'bg-indigo-950/80',
      text: 'text-indigo-300',
      border: 'border-indigo-500/40',
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />,
      animate: true,
    },
    question_ready: {
      label: 'Question Ready',
      bg: 'bg-cyan-950/80',
      text: 'text-cyan-300',
      border: 'border-cyan-500/40',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />,
    },
    evaluating_answer: {
      label: 'Gemini is evaluating your answer...',
      bg: 'bg-amber-950/80',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      icon: <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />,
      animate: true,
    },
    generating_feedback: {
      label: 'Synthesizing final feedback report...',
      bg: 'bg-purple-950/80',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />,
      animate: true,
    },
    saving_result: {
      label: 'Saving score & feedback...',
      bg: 'bg-blue-950/80',
      text: 'text-blue-300',
      border: 'border-blue-500/40',
      icon: <FileCheck className="w-3.5 h-3.5 text-blue-400 animate-pulse" />,
    },
    completed: {
      label: 'Interview Completed',
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    },
    failed: {
      label: 'Processing Issue',
      bg: 'bg-rose-950/80',
      text: 'text-rose-300',
      border: 'border-rose-500/40',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />,
    },
  };

  const current = configMap[status] || configMap.waiting;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border} shadow-sm backdrop-blur-sm transition-all duration-300 ${
        current.animate ? 'animate-pulse-subtle' : ''
      }`}
    >
      {current.icon}
      <span>{current.label}</span>
    </div>
  );
};
