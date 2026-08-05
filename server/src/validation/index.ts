import { z } from 'zod';

// Register Form Schema
export const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  full_name: z.string().min(2, 'Full name is required'),
});

// Login Form Schema
export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Profile Form Schema
export const ProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email().optional(),
  university: z.string().optional().default(''),
  current_year: z.string().optional().default(''),
  target_role: z.string().min(1, 'Target role is required'),
  experience_level: z.string().min(1, 'Experience level is required'),
  preferred_difficulty: z.string().min(1, 'Preferred difficulty is required'),
  known_technologies: z.array(z.string()).default([]),
  weak_technologies: z.array(z.string()).default([]),
  daily_preparation_minutes: z.number().min(15).max(360).default(60),
});

// Interview Setup Schema
export const InterviewSetupSchema = z.object({
  target_role: z.string().min(1, 'Target role is required'),
  interview_type: z.enum(['Technical', 'HR', 'Mixed']),
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  total_questions: z.number().min(1).max(10),
});

// Student Answer Submission Schema
export const StudentAnswerSchema = z.object({
  question_id: z.string().uuid(),
  student_answer: z.string().min(5, 'Answer must be at least 5 characters long').max(5000, 'Answer is too long (max 5000 characters)'),
});

// Gemini Question Response Schema
export const GeminiQuestionSchema = z.object({
  question: z.string().min(5),
  topic: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  skill_tested: z.string(),
  expected_points: z.array(z.string()).min(1),
});

// Gemini Evaluation Response Schema
export const GeminiEvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  result: z.string(),
  correct_points: z.array(z.string()),
  missing_points: z.array(z.string()),
  incorrect_points: z.array(z.string()),
  technical_feedback: z.string(),
  communication_feedback: z.string(),
  improved_answer: z.string(),
  follow_up_question: z.string().optional(),
  recommended_topic: z.string().optional(),
});

// Final Report Response Schema
export const GeminiFinalReportSchema = z.object({
  overall_score: z.number().min(0).max(100),
  performance_level: z.string(),
  strong_areas: z.array(z.string()),
  weak_areas: z.array(z.string()),
  technical_summary: z.string(),
  communication_summary: z.string(),
  topics_to_revise: z.array(z.string()),
  next_difficulty: z.string(),
  final_message: z.string(),
});

// Study Plan Response Schema
export const StudyPlanDaySchema = z.object({
  day: z.number(),
  topic: z.string(),
  objective: z.string(),
  learning_activity: z.string(),
  practice_activity: z.string(),
  duration_minutes: z.number(),
});

export const GeminiStudyPlanSchema = z.object({
  plan_title: z.string(),
  days: z.array(StudyPlanDaySchema).length(7),
});
