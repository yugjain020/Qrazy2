'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              border: '1px solid var(--toast-border, #e5e7eb)',
              padding: '12px 16px',
            },
            className: 'bg-white text-gray-900 dark:bg-dark-card dark:text-gray-100 dark:border-dark-border',
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}