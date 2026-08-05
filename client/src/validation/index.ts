import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  full_name: z.string().min(2, 'Full name is required'),
});

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

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

export const InterviewSetupSchema = z.object({
  target_role: z.string().min(1, 'Target role is required'),
  interview_type: z.enum(['Technical', 'HR', 'Mixed']),
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  total_questions: z.number().min(1).max(10),
});

export const StudentAnswerSchema = z.object({
  question_id: z.string().uuid(),
  student_answer: z.string().min(5, 'Answer must be at least 5 characters long').max(5000, 'Answer is too long (max 5000 characters)'),
});
