import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { fetchApi } from '../lib/api';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isDemoUser: boolean;
  enableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  const fetchProfile = async (currentUserId: string) => {
    try {
      const data = await fetchApi<UserProfile>('/api/profile');
      setProfile(data);
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const enableDemoMode = () => {
    const demoId = 'demo-student-id';
    const demoToken = `demo-user-token-${demoId}`;
    localStorage.setItem('careerpilot_demo_token', demoToken);
    setIsDemoUser(true);
    const mockUser = {
      id: demoId,
      email: 'demo@careerpilot.ai',
      app_metadata: {},
      user_metadata: { full_name: 'Demo Student' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;
    setUser(mockUser);
    fetchProfile(demoId);
  };

  useEffect(() => {
    // Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        // Check local demo token if offline/preview without Supabase config
        const demoToken = localStorage.getItem('careerpilot_demo_token');
        if (demoToken) {
          enableDemoMode();
        }
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsDemoUser(false);
        localStorage.removeItem('careerpilot_demo_token');
        fetchProfile(session.user.id);
      } else if (!localStorage.getItem('careerpilot_demo_token')) {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        // Fallback to local demo auth if Supabase project credentials are dummy
        if (email.includes('demo') || email.includes('test') || !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
          enableDemoMode();
          setLoading(false);
          return;
        }
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (email: string, pass: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
          enableDemoMode();
          setLoading(false);
          return;
        }
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        // Initialize profile
        await fetchApi('/api/profile', {
          method: 'PUT',
          body: JSON.stringify({
            full_name: fullName,
            email,
            target_role: 'Full-Stack Developer',
            experience_level: 'Entry-Level / Student',
            preferred_difficulty: 'Medium',
            known_technologies: ['React', 'JavaScript'],
            weak_technologies: ['SQL', 'System Design'],
            daily_preparation_minutes: 60,
          }),
        }).catch(() => {});
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('careerpilot_demo_token');
      await supabase.auth.signOut().catch(() => {});
      setUser(null);
      setProfile(null);
      setIsDemoUser(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        isDemoUser,
        enableDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
