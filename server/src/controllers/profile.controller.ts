import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { supabaseAdmin } from '../services/supabase.js';
import { ProfileSchema } from '../validation/index.js';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
      return;
    }

    if (!profile) {
      // Return default onboarding structure if profile record not found yet
      res.json({
        id: userId,
        full_name: '',
        email: req.user?.email || '',
        university: '',
        current_year: '',
        target_role: 'Full-Stack Developer',
        experience_level: 'Entry-Level / Student',
        preferred_difficulty: 'Medium',
        known_technologies: ['React', 'Node.js', 'JavaScript'],
        weak_technologies: ['System Design', 'SQL Optimization'],
        daily_preparation_minutes: 60,
        role: 'student',
        onboarding_completed: false,
      });
      return;
    }

    res.json(profile);
  } catch (err) {
    console.error('Profile Controller Get Error:', err);
    res.status(500).json({ error: 'Server error retrieving profile' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parseResult = ProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid profile data', details: parseResult.error.flatten() });
      return;
    }

    const profileData = {
      id: userId,
      ...parseResult.data,
      email: req.user?.email || parseResult.data.email,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to save profile updates' });
      return;
    }

    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (err) {
    console.error('Profile Controller Update Error:', err);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};
