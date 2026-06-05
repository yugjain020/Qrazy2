'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { type ThemeOption, type ResolvedTheme } from '@/types';
import { useAuth } from '@/lib/contexts/AuthContext';
import { updateUserThemePreference } from '@/lib/firebase/firestore';

interface ThemeContextType {
  theme: ThemeOption;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeOption) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'qrazy-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveTheme(theme: ThemeOption): ResolvedTheme {
  if (theme === 'system') return getSystemTheme();
  return theme;
}

function applyThemeToDOM(resolved: ResolvedTheme) {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  root.setAttribute('data-theme', resolved);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeOption>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);
  const { user, userProfile } = useAuth();

  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeOption | null;
    const initialTheme = stored || 'system';
    const resolved = resolveTheme(initialTheme);
    setThemeState(initialTheme);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
    setMounted(true);
  }, []);

  // Sync theme from Firestore when userProfile loads (after login)
  useEffect(() => {
    if (userProfile?.themePreference && mounted) {
      const firestoreTheme = userProfile.themePreference;
      const resolved = resolveTheme(firestoreTheme);
      setThemeState(firestoreTheme);
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved);
      localStorage.setItem(STORAGE_KEY, firestoreTheme);
    }
  }, [userProfile, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        applyThemeToDOM(resolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = useCallback(
    (newTheme: ThemeOption) => {
      const resolved = resolveTheme(newTheme);
      setThemeState(newTheme);
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved);
      localStorage.setItem(STORAGE_KEY, newTheme);

      // Sync to Firestore if user is logged in
      if (user) {
        updateUserThemePreference(user.uid, newTheme).catch(console.error);
      }
    },
    [user]
  );

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}