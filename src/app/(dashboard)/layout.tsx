'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useIdleTimeout, useMultiTabSync } from '@/lib/hooks';
import EmailVerificationGate from '@/components/auth/EmailVerificationGate';
import Sidebar from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import Header from '@/components/layout/Header';
import { Loader2, QrCode } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Not logged in
  if (!user) {
    return null;
  }

  // Logged in but email not verified
  if (!user.emailVerified) {
    return <EmailVerificationGate>{children}</EmailVerificationGate>;
  }

  // Logged in and verified - show full dashboard layout
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar Drawer */}
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}