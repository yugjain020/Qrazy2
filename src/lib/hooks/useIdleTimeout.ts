'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT = 25 * 60 * 1000; // Show warning at 25 minutes
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
];

export function useIdleTimeout() {
  const { user, signOut } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    // Only set timers if user is logged in
    if (!user) return;

    // Warning timer
    warningRef.current = setTimeout(() => {
      // Could show a toast/modal here
      console.log('Session will expire in 5 minutes due to inactivity');
    }, WARNING_TIMEOUT);

    // Logout timer
    timeoutRef.current = setTimeout(async () => {
      console.log('Session expired due to inactivity');
      await signOut();
      window.location.href = '/login';
    }, IDLE_TIMEOUT);
  }, [user, signOut]);

  useEffect(() => {
    if (!user) return;

    // Set initial timer
    resetTimer();

    // Add event listeners for user activity
    const handleActivity = () => {
      resetTimer();
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, resetTimer]);
}