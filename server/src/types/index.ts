export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  university?: string;
  current_year?: string;
  target_role?: string;
  experience_level?: string;
  preferred_difficulty?: string;
  known_technologies?: string[];
  weak_technologies?: string[];
  daily_preparation_minutes?: number;
  role?: string;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ProcessingStatus =
  | 'waiting'
  | 'generating_question'
  | 'question_ready'
  | 'evaluating_answer'
  | 'generating_feedback'
  | 'saving_result'
  | 'completed'
  | 'failed';

export interface InterviewSession {
  id: string;
  user_id: string;
  target_role: string;
  interview_type: string;
  topic: string;
  difficulty: string;
  total_questions: number;
  current_question_number: number;
  status: 'in_progress' | 'completed' | 'failed';
  processing_status: ProcessingStatus;
  overall_score?: number;
  performance_level?: string;
  technical_summary?: string;
  communication_summary?: string;
  strong_areas?: string[];
  weak_areas?: string[];
  topics_to_revise?: string[];
  next_difficulty?: string;
  final_message?: string;
  started_at?: string;
  completed_at?: string;
}

export interface GeneratedQuestionResponse {
  question: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  skill_tested: string;
  expected_points: string[];
}

export interface AnswerEvaluationResponse {
  score: number;
  result: string;
  correct_points: string[];
  missing_points: string[];
  incorrect_points: string[];
  technical_feedback: string;
  communication_feedback: string;
  improved_answer: string;
  follow_up_question?: string;
  recommended_topic?: string;
}

export interface FinalReportResponse {
  overall_score: number;
  performance_level: string;
  strong_areas: string[];
  weak_areas: string[];
  technical_summary: string;
  communication_summary: string;
  topics_to_revise: string[];
  next_difficulty: string;
  final_message: string;
}

export interface StudyPlanDay {
  day: number;
  topic: string;
  objective: string;
  learning_activity: string;
  practice_activity: string;
  duration_minutes: number;
}

export interface StudyPlanResponse {
  plan_title: string;
  days: StudyPlanDay[];
}
