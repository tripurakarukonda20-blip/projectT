import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase.js';

export const getDashboardData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 1. Profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // 2. Recent Sessions
    const { data: recentSessions } = await supabaseAdmin
      .from('interview_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // 3. Progress metrics
    const { data: progressRecords } = await supabaseAdmin
      .from('progress')
      .select('*')
      .eq('user_id', userId);

    // 4. Latest Study Plan
    const { data: latestPlan } = await supabaseAdmin
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Aggregate statistics
    const completedSessions = (recentSessions || []).filter((s) => s.status === 'completed');
    const totalCompleted = completedSessions.length;
    const avgScore = totalCompleted > 0
      ? Math.round(completedSessions.reduce((acc, s) => acc + Number(s.overall_score || 0), 0) / totalCompleted)
      : 0;

    res.json({
      profile: profile || null,
      stats: {
        total_interviews: recentSessions?.length || 0,
        completed_interviews: totalCompleted,
        average_score: avgScore,
        topics_covered: progressRecords?.length || 0,
      },
      recent_sessions: recentSessions || [],
      progress: progressRecords || [],
      latest_study_plan: latestPlan || null,
    });
  } catch (err) {
    console.error('Get Dashboard Error:', err);
    res.status(500).json({ error: 'Server error retrieving dashboard data' });
  }
};

export const getProgressData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data: progressRecords, error } = await supabaseAdmin
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching progress data:', error);
      res.status(500).json({ error: 'Failed to fetch progress metrics' });
      return;
    }

    res.json(progressRecords || []);
  } catch (err) {
    console.error('Get Progress Error:', err);
    res.status(500).json({ error: 'Server error fetching progress data' });
  }
};
