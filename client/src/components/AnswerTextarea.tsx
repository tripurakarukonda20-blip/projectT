import React from 'react';
import { Send, Sparkles } from 'lucide-react';

interface AnswerTextareaProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export const AnswerTextarea: React.FC<AnswerTextareaProps> = ({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  disabled = false,
}) => {
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const minChars = 15;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (charCount >= minChars && !isSubmitting && !disabled) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <label htmlFor="answer-input" className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Your Response
        </label>
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span className={charCount > 4500 ? 'text-amber-400 font-bold' : ''}>
            {charCount}/5000
          </span>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="answer-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isSubmitting}
          placeholder="Type your interview answer clearly here... Highlight key technical choices, trade-offs, and practical implementations."
          rows={6}
          className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 text-sm leading-relaxed outline-none transition-all duration-200 resize-y disabled:opacity-50 font-sans"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] text-slate-500 italic">
          {charCount < minChars ? `Type at least ${minChars - charCount} more character(s) to submit.` : 'Ready for Gemini AI evaluation!'}
        </p>

        <button
          type="submit"
          disabled={disabled || isSubmitting || charCount < minChars}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Answer</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
