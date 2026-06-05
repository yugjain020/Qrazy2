'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useIdleTimeout, useMultiTabSync } from '@/lib/hooks';
import EmailVerificationGate from '@/components/auth/EmailVerificationGate';
import { Loader2, QrCode } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Session management hooks
  useIdleTimeout();
  useMultiTabSync();

  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true);
      router.push('/login');
    }
  }, [user, loading, router]);

  // Loading state
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center animate-pulse">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isRedirecting
              ? 'Redirecting to login...'
              : 'Loading your workspace...'}
          </p>
        </div>
      </div>
    );
  }

  // Not logged in - will redirect
  if (!user) {
    return null;
  }

  // Logged in but email not verified - show verification gate
  if (!user.emailVerified) {
    return <EmailVerificationGate>{children}</EmailVerificationGate>;
  }

  // Logged in and verified - show dashboard
  return <>{children}</>;
}