'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

const STORAGE_KEY = 'qrazy-auth-event';

export function useMultiTabSync() {
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Listen for auth events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;

      const event = e.newValue;
      if (event === 'logout') {
        // Another tab logged out — log out this tab too
        window.location.href = '/login';
      } else if (event === 'login' && !user) {
        // Another tab logged in — reload this tab
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  // Override signOut to broadcast to other tabs
  useEffect(() => {
    const originalSignOut = signOut;

    const broadcastSignOut = async () => {
      localStorage.setItem(STORAGE_KEY, 'logout');
      localStorage.removeItem(STORAGE_KEY);
      await originalSignOut();
    };

    // Expose broadcastSignOut globally (optional)
    // For now, the signOut in AuthContext doesn't need modification
    // because we handle this via onAuthStateChanged listener
  }, [signOut]);
}