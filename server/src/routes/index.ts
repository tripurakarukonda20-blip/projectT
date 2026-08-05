import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { getDashboardData, getProgressData } from '../controllers/dashboard.controller.js';
import {
  startInterview,
  getInterviews,
  getInterviewById,
  generateNextQuestion,
  submitAnswer,
  completeInterview,
} from '../controllers/interview.controller.js';
import {
  createStudyPlan,
  getStudyPlans,
  getStudyPlanById,
} from '../controllers/studyPlan.controller.js';

const router = Router();

// Profile routes
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

// Dashboard routes
router.get('/dashboard', requireAuth, getDashboardData);

// Interview routes
router.post('/interviews/start', requireAuth, startInterview);
router.get('/interviews', requireAuth, getInterviews);
router.get('/interviews/:id', requireAuth, getInterviewById);
router.post('/interviews/:id/question', requireAuth, generateNextQuestion);
router.post('/interviews/:id/answer', requireAuth, submitAnswer);
router.post('/interviews/:id/complete', requireAuth, completeInterview);

// Study plan routes
router.post('/study-plans', requireAuth, createStudyPlan);
router.get('/study-plans', requireAuth, getStudyPlans);
router.get('/study-plans/:id', requireAuth, getStudyPlanById);

// Progress routes
router.get('/progress', requireAuth, getProgressData);

export default router;
