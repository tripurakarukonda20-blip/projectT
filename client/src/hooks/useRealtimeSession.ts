import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { InterviewSession, ProcessingStatus } from '../types';

export function useRealtimeSession(sessionId: string | undefined, initialSession: InterviewSession | null) {
  const { user } = useAuth();
  const [session, setSession] = useState<InterviewSession | null>(initialSession);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>(
    initialSession?.processing_status || 'waiting'
  );

  useEffect(() => {
    setSession(initialSession);
    if (initialSession) {
      setProcessingStatus(initialSession.processing_status);
    }
  }, [initialSession]);

  useEffect(() => {
    if (!sessionId || !user?.id) return;

    // Security check: Only subscribe to session matching current logged in user's ID
    const channelName = `session_updates_${sessionId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'interview_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const updatedRow = payload.new as InterviewSession;
          // Verify user_id matches logged in user
          if (updatedRow && updatedRow.user_id === user.id) {
            setSession(updatedRow);
            if (updatedRow.processing_status) {
              setProcessingStatus(updatedRow.processing_status);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, user?.id]);

  return { session, setSession, processingStatus, setProcessingStatus };
}
