import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ProcessingStatusBadge } from '../components/ProcessingStatusBadge';
import { InterviewQuestionCard } from '../components/InterviewQuestionCard';
import { AnswerTextarea } from '../components/AnswerTextarea';
import { EvaluationResultCard } from '../components/EvaluationResultCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { fetchApi } from '../lib/api';
import { useRealtimeSession } from '../hooks/useRealtimeSession';
import { InterviewSession, InterviewQuestion, InterviewAnswer } from '../types';

export const LiveInterviewPage: React.FC = () => {
  const { id: sessionId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialSession, setInitialSession] = useState<InterviewSession | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answerInput, setAnswerInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const { session, processingStatus } = useRealtimeSession(sessionId, initialSession);

  // Load session details
  const loadSessionData = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<{
        session: InterviewSession;
        questions: InterviewQuestion[];
        answers: InterviewAnswer[];
      }>(`/api/interviews/${sessionId}`);

      setInitialSession(data.session);
      setQuestions(data.questions || []);
      setAnswers(data.answers || []);

      // If session in_progress and no questions generated yet, trigger first question
      if (data.session.status === 'in_progress' && (data.questions || []).length === 0) {
        await generateQuestion();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load interview session details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  // Generate next question via backend / Gemini
  const generateQuestion = async () => {
    if (!sessionId) return;
    setError(null);
    try {
      const newQuestion = await fetchApi<InterviewQuestion>(`/api/interviews/${sessionId}/question`, {
        method: 'POST',
      });
      setQuestions((prev) => [...prev.filter((q) => q.id !== newQuestion.id), newQuestion]);
      setAnswerInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate next question');
    }
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!sessionId || currentQuestion === undefined) return;
    setIsEvaluating(true);
    setError(null);
    try {
      const res = await fetchApi<{ message: string; evaluation: InterviewAnswer }>(
        `/api/interviews/${sessionId}/answer`,
        {
          method: 'POST',
          body: JSON.stringify({
            question_id: currentQuestion.id,
            student_answer: answerInput,
          }),
        }
      );

      if (res.evaluation) {
        setAnswers((prev) => [...prev.filter((a) => a.question_id !== currentQuestion.id), res.evaluation]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer for evaluation');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Finalize interview session
  const handleCompleteInterview = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      await fetchApi(`/api/interviews/${sessionId}/complete`, {
        method: 'POST',
      });
      navigate(`/interview/${sessionId}/result`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize interview report');
      setLoading(false);
    }
  };

  const currentQuestion = questions[questions.length - 1];
  const currentAnswer = currentQuestion ? answers.find((a) => a.question_id === currentQuestion.id) : undefined;
  const isLastQuestion = session ? session.current_question_number >= session.total_questions : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Top Session Status Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-3 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-white">{session?.target_role || 'Mock Interview'}</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">• {session?.topic}</span>
          </div>

          <div className="flex items-center gap-4">
            <ProcessingStatusBadge status={processingStatus} />
            <button
              onClick={() => setShowExitConfirm(true)}
              className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
            >
              Exit Session
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {loading ? (
          <LoadingState message="Connecting with Gemini AI Interview Coach..." />
        ) : error ? (
          <ErrorAlert message={error} onRetry={loadSessionData} />
        ) : !currentQuestion ? (
          <div className="text-center py-12 space-y-4">
            <LoadingState message="Generating tailored interview question..." />
            <button
              onClick={generateQuestion}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Retry Question Generation
            </button>
          </div>
        ) : (
          <>
            {/* Active Question Card */}
            <InterviewQuestionCard
              question={currentQuestion}
              currentNumber={session?.current_question_number || 1}
              totalQuestions={session?.total_questions || 3}
            />

            {/* Answer Input or Evaluated Feedback */}
            {!currentAnswer ? (
              <div className="glass-card p-6 rounded-2xl border border-slate-800">
                <AnswerTextarea
                  value={answerInput}
                  onChange={setAnswerInput}
                  onSubmit={handleSubmitAnswer}
                  isSubmitting={isEvaluating || processingStatus === 'evaluating_answer'}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <EvaluationResultCard answer={currentAnswer} />

                {/* Navigation actions: Next Question or Finalize */}
                <div className="flex items-center justify-end gap-4">
                  {!isLastQuestion ? (
                    <button
                      onClick={generateQuestion}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteInterview}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Synthesize Final Report</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Exit Interview Session?"
        message="Your progress so far will be saved in history, but active session evaluation will pause."
        confirmText="Exit to Dashboard"
        cancelText="Stay in Interview"
        onConfirm={() => navigate('/dashboard')}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
};
