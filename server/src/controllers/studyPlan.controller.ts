import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase.js';
import { generateStudyPlan } from '../services/gemini.js';

export const createStudyPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { session_id } = req.body;

    // Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    let targetRole = profile?.target_role || 'Software Developer';
    let weakAreas = profile?.weak_technologies || [];
    let experienceLevel = profile?.experience_level || 'Entry-Level / Student';
    let dailyTime = profile?.daily_preparation_minutes || 60;

    // If session_id provided, supplement with session details
    if (session_id) {
      const { data: session } = await supabaseAdmin
        .from('interview_sessions')
        .select('*')
        .eq('id', session_id)
        .eq('user_id', userId)
        .single();

      if (session) {
        targetRole = session.target_role;
        if (session.weak_areas && Array.isArray(session.weak_areas)) {
          weakAreas = Array.from(new Set([...weakAreas, ...session.weak_areas]));
        }
      }
    }

    // Generate study plan with Gemini
    const planResult = await generateStudyPlan({
      target_role: targetRole,
      experience_level: experienceLevel,
      weak_areas: weakAreas,
      daily_time: dailyTime,
    });

    // Save to database
    const { data: savedPlan, error } = await supabaseAdmin
      .from('study_plans')
      .insert({
        user_id: userId,
        session_id: session_id || null,
        plan_title: planResult.plan_title,
        plan_content: planResult,
      })
      .select()
      .single();

    if (error || !savedPlan) {
      console.error('Error saving study plan:', error);
      res.status(500).json({ error: 'Failed to save generated study plan' });
      return;
    }

    res.status(201).json({
      message: '7-Day Study Plan created successfully',
      plan: savedPlan,
    });
  } catch (err) {
    console.error('Create Study Plan Error:', err);
    res.status(500).json({ error: 'Server error generating study plan' });
  }
};

export const getStudyPlans = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data: plans, error } = await supabaseAdmin
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching study plans:', error);
      res.status(500).json({ error: 'Failed to fetch study plans' });
      return;
    }

    res.json(plans || []);
  } catch (err) {
    console.error('Get Study Plans Error:', err);
    res.status(500).json({ error: 'Server error fetching study plans' });
  }
};

export const getStudyPlanById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data: plan, error } = await supabaseAdmin
      .from('study_plans')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !plan) {
      res.status(404).json({ error: 'Study plan not found or permission denied' });
      return;
    }

    res.json(plan);
  } catch (err) {
    console.error('Get Study Plan By Id Error:', err);
    res.status(500).json({ error: 'Server error fetching study plan details' });
  }
};
