import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase.js';
import { InterviewSetupSchema, StudentAnswerSchema } from '../validation/index.js';
import { generateQuestion, evaluateAnswer, generateFinalReport } from '../services/gemini.js';

/**
 * Start a new interview session
 */
export const startInterview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parseResult = InterviewSetupSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid interview setup configuration', details: parseResult.error.flatten() });
      return;
    }

    const { target_role, interview_type, topic, difficulty, total_questions } = parseResult.data;

    const { data: session, error } = await supabaseAdmin
      .from('interview_sessions')
      .insert({
        user_id: userId,
        target_role,
        interview_type,
        topic,
        difficulty,
        total_questions,
        current_question_number: 0,
        status: 'in_progress',
        processing_status: 'waiting',
      })
      .select()
      .single();

    if (error || !session) {
      console.error('Error starting interview session:', error);
      res.status(500).json({ error: 'Failed to create interview session' });
      return;
    }

    res.status(201).json({ message: 'Interview session started', session });
  } catch (err) {
    console.error('Start Interview Error:', err);
    res.status(500).json({ error: 'Server error starting interview' });
  }
};

/**
 * Get all interview sessions for the logged-in user
 */
export const getInterviews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data: sessions, error } = await supabaseAdmin
      .from('interview_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interviews:', error);
      res.status(500).json({ error: 'Failed to fetch interview history' });
      return;
    }

    res.json(sessions || []);
  } catch (err) {
    console.error('Get Interviews Error:', err);
    res.status(500).json({ error: 'Server error fetching interviews' });
  }
};

/**
 * Get specific interview session by ID
 */
export const getInterviewById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data: session, error: sessionError } = await supabaseAdmin
      .from('interview_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (sessionError || !session) {
      res.status(404).json({ error: 'Interview session not found or permission denied' });
      return;
    }

    // Fetch questions
    const { data: questions } = await supabaseAdmin
      .from('interview_questions')
      .select('id, session_id, question, topic, difficulty, skill_tested, question_order, created_at')
      .eq('session_id', id)
      .order('question_order', { ascending: true });

    // Fetch answers
    const { data: answers } = await supabaseAdmin
      .from('interview_answers')
      .select('*')
      .eq('session_id', id);

    res.json({
      session,
      questions: questions || [],
      answers: answers || [],
    });
  } catch (err) {
    console.error('Get Interview By Id Error:', err);
    res.status(500).json({ error: 'Server error fetching interview details' });
  }
};

/**
 * Generate next interview question for a session
 */
export const generateNextQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id: sessionId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Fetch & verify session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (sessionError || !session) {
      res.status(404).json({ error: 'Interview session not found or unauthorized' });
      return;
    }

    if (session.status === 'completed') {
      res.status(400).json({ error: 'Interview session is already completed' });
      return;
    }

    // Update processing status
    await supabaseAdmin
      .from('interview_sessions')
      .update({ processing_status: 'generating_question' })
      .eq('id', sessionId);

    // 2. Fetch user profile for context
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // 3. Fetch previous questions to avoid repetition
    const { data: previousQuestions } = await supabaseAdmin
      .from('interview_questions')
      .select('question')
      .eq('session_id', sessionId);

    const questionOrder = (previousQuestions?.length || 0) + 1;

    // 4. Generate via Gemini service
    const generatedData = await generateQuestion({
      target_role: session.target_role,
      interview_type: session.interview_type,
      topic: session.topic,
      difficulty: session.difficulty as 'Easy' | 'Medium' | 'Hard',
      experience_level: profile?.experience_level || 'Entry-Level / Student',
      previous_questions: previousQuestions?.map((q) => q.question) || [],
      weak_areas: profile?.weak_technologies || [],
    });

    // 5. Save question in DB
    const { data: insertedQuestion, error: insertError } = await supabaseAdmin
      .from('interview_questions')
      .insert({
        session_id: sessionId,
        user_id: userId,
        question: generatedData.question,
        topic: generatedData.topic,
        difficulty: generatedData.difficulty,
        skill_tested: generatedData.skill_tested,
        expected_points: generatedData.expected_points,
        question_order: questionOrder,
      })
      .select()
      .single();

    if (insertError || !insertedQuestion) {
      console.error('Error inserting question:', insertError);
      await supabaseAdmin.from('interview_sessions').update({ processing_status: 'failed' }).eq('id', sessionId);
      res.status(500).json({ error: 'Failed to save generated question' });
      return;
    }

    // 6. Update session progress status
    await supabaseAdmin
      .from('interview_sessions')
      .update({
        current_question_number: questionOrder,
        processing_status: 'question_ready',
      })
      .eq('id', sessionId);

    // Return safe question object without exposing expected_points
    res.json({
      id: insertedQuestion.id,
      session_id: sessionId,
      question: insertedQuestion.question,
      topic: insertedQuestion.topic,
      difficulty: insertedQuestion.difficulty,
      skill_tested: insertedQuestion.skill_tested,
      question_order: insertedQuestion.question_order,
    });
  } catch (err) {
    console.error('Generate Question Error:', err);
    if (req.params.id) {
      await supabaseAdmin.from('interview_sessions').update({ processing_status: 'failed' }).eq('id', req.params.id);
    }
    res.status(500).json({ error: 'Server error generating question' });
  }
};

/**
 * Submit and evaluate answer for a question
 */
export const submitAnswer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id: sessionId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parseResult = StudentAnswerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid answer payload', details: parseResult.error.flatten() });
      return;
    }

    const { question_id, student_answer } = parseResult.data;

    // Check duplicate submission
    const { data: existingAnswer } = await supabaseAdmin
      .from('interview_answers')
      .select('id')
      .eq('question_id', question_id)
      .single();

    if (existingAnswer) {
      res.status(400).json({ error: 'Answer for this question has already been submitted' });
      return;
    }

    // 1. Fetch session & question
    const { data: session } = await supabaseAdmin
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!session) {
      res.status(404).json({ error: 'Interview session not found or unauthorized' });
      return;
    }

    const { data: question } = await supabaseAdmin
      .from('interview_questions')
      .select('*')
      .eq('id', question_id)
      .single();

    if (!question) {
      res.status(404).json({ error: 'Interview question not found' });
      return;
    }

    // Update status to evaluating_answer
    await supabaseAdmin
      .from('interview_sessions')
      .update({ processing_status: 'evaluating_answer' })
      .eq('id', sessionId);

    // 2. Fetch profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('experience_level')
      .eq('id', userId)
      .single();

    // 3. Evaluate answer with Gemini
    const evaluation = await evaluateAnswer({
      question: question.question,
      expected_points: question.expected_points || [],
      student_answer,
      experience_level: profile?.experience_level || 'Entry-Level / Student',
    });

    // Update status to saving_result
    await supabaseAdmin
      .from('interview_sessions')
      .update({ processing_status: 'saving_result' })
      .eq('id', sessionId);

    // 4. Save answer evaluation
    const { data: savedAnswer, error: saveError } = await supabaseAdmin
      .from('interview_answers')
      .insert({
        question_id,
        session_id: sessionId,
        user_id: userId,
        student_answer,
        score: evaluation.score,
        result: evaluation.result,
        correct_points: evaluation.correct_points,
        missing_points: evaluation.missing_points,
        incorrect_points: evaluation.incorrect_points,
        technical_feedback: evaluation.technical_feedback,
        communication_feedback: evaluation.communication_feedback,
        improved_answer: evaluation.improved_answer,
        follow_up_question: evaluation.follow_up_question || '',
        recommended_topic: evaluation.recommended_topic || '',
      })
      .select()
      .single();

    if (saveError || !savedAnswer) {
      console.error('Error saving answer evaluation:', saveError);
      await supabaseAdmin.from('interview_sessions').update({ processing_status: 'failed' }).eq('id', sessionId);
      res.status(500).json({ error: 'Failed to save evaluation result' });
      return;
    }

    // 5. Update user progress stats
    try {
      const { data: existingProgress } = await supabaseAdmin
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('topic', session.topic)
        .single();

      const newAttempts = (existingProgress?.attempts || 0) + 1;
      const prevAvg = Number(existingProgress?.average_score || 0);
      const newAvg = Number(((prevAvg * (newAttempts - 1) + evaluation.score) / newAttempts).toFixed(1));
      const bestScore = Math.max(Number(existingProgress?.best_score || 0), evaluation.score);

      await supabaseAdmin.from('progress').upsert({
        user_id: userId,
        topic: session.topic,
        attempts: newAttempts,
        average_score: newAvg,
        best_score: bestScore,
        last_attempted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (progressErr) {
      console.error('Progress update error (non-fatal):', progressErr);
    }

    // Update status back to waiting
    await supabaseAdmin
      .from('interview_sessions')
      .update({ processing_status: 'waiting' })
      .eq('id', sessionId);

    res.json({
      message: 'Answer evaluated successfully',
      evaluation: savedAnswer,
    });
  } catch (err) {
    console.error('Submit Answer Error:', err);
    if (req.params.id) {
      await supabaseAdmin.from('interview_sessions').update({ processing_status: 'failed' }).eq('id', req.params.id);
    }
    res.status(500).json({ error: 'Server error evaluating answer' });
  }
};

/**
 * Finalize and synthesize final interview report
 */
export const completeInterview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id: sessionId } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Fetch session
    const { data: session } = await supabaseAdmin
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!session) {
      res.status(404).json({ error: 'Session not found or unauthorized' });
      return;
    }

    await supabaseAdmin
      .from('interview_sessions')
      .update({ processing_status: 'generating_feedback' })
      .eq('id', sessionId);

    // Fetch questions & answers
    const { data: questions } = await supabaseAdmin
      .from('interview_questions')
      .select('id, question')
      .eq('session_id', sessionId);

    const { data: answers } = await supabaseAdmin
      .from('interview_answers')
      .select('*')
      .eq('session_id', sessionId);

    const questionMap = new Map((questions || []).map((q) => [q.id, q.question]));

    const interviewResults = (answers || []).map((a) => ({
      question: questionMap.get(a.question_id) || 'Interview Question',
      student_answer: a.student_answer,
      score: a.score,
      correct_points: a.correct_points,
      missing_points: a.missing_points,
    }));

    // Generate report via Gemini
    const report = await generateFinalReport({
      target_role: session.target_role,
      interview_type: session.interview_type,
      difficulty: session.difficulty,
      interview_results: interviewResults,
    });

    // Update interview session in DB
    const { data: updatedSession, error: updateError } = await supabaseAdmin
      .from('interview_sessions')
      .update({
        status: 'completed',
        processing_status: 'completed',
        overall_score: report.overall_score,
        performance_level: report.performance_level,
        technical_summary: report.technical_summary,
        communication_summary: report.communication_summary,
        strong_areas: report.strong_areas,
        weak_areas: report.weak_areas,
        topics_to_revise: report.topics_to_revise,
        next_difficulty: report.next_difficulty,
        final_message: report.final_message,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (updateError || !updatedSession) {
      console.error('Error completing interview session:', updateError);
      await supabaseAdmin.from('interview_sessions').update({ processing_status: 'failed' }).eq('id', sessionId);
      res.status(500).json({ error: 'Failed to update interview completion status' });
      return;
    }

    res.json({
      message: 'Interview session completed successfully',
      session: updatedSession,
      report,
    });
  } catch (err) {
    console.error('Complete Interview Error:', err);
    if (req.params.id) {
      await supabaseAdmin.from('interview_sessions').update({ processing_status: 'failed' }).eq('id', req.params.id);
    }
    res.status(500).json({ error: 'Server error finalizing interview report' });
  }
};
