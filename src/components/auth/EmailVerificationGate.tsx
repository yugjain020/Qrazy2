'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  Mail,
  Loader2,
  ArrowRight,
  RefreshCw,
  LogOut,
  QrCode,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface EmailVerificationGateProps {
  children: ReactNode;
}

export default function EmailVerificationGate({
  children,
}: EmailVerificationGateProps) {
  const { user, resendEmailVerification, signOut, refreshUserProfile } =
    useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Check verification status
  useEffect(() => {
    if (user) {
      // Force refresh the ID token to get the latest emailVerified status
      const checkVerification = async () => {
        try {
          await user.reload();
          setIsVerified(user.emailVerified);
        } catch {
          // If reload fails, use current state
          setIsVerified(user.emailVerified);
        }
      };
      checkVerification();
    }
  }, [user]);

  const handleResend = async () => {
    try {
      setIsResending(true);
      await resendEmailVerification();
      toast.success('Verification email sent! Check your inbox.');
    } catch {
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await user?.reload();
      if (user?.emailVerified) {
        setIsVerified(true);
        toast.success('Email verified! Welcome to QRAZY.');
      } else {
        toast.error('Email not verified yet. Please check your inbox.');
      }
    } catch {
      toast.error('Failed to check verification status.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // If verified, show the children (dashboard)
  if (isVerified) {
    return <>{children}</>;
  }

  // If not verified, show the verification gate
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="max-w-lg w-full"
      >
        <div className="glass-card p-8 sm:p-10 text-center space-y-6">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
              QRAZY
            </span>
          </Link>

          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-900/30 mx-auto flex items-center justify-center">
            <Mail className="w-10 h-10 text-brand-600 dark:text-brand-400" />
          </div>

          {/* Title */}
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              We&apos;ve sent a verification link to{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {user?.email}
              </span>
              . Please check your inbox and click the link to activate your
              account.
            </p>
          </div>

          {/* Steps */}
          <div className="bg-slate-50 dark:bg-dark-surface rounded-xl p-4 text-left space-y-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Steps to verify
            </p>
            {[
              'Check your email inbox (and spam folder)',
              'Click the verification link in the email',
              'Come back here and click "I\'ve Verified My Email"',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                    {i + 1}
                  </span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  I&apos;ve Verified My Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </button>

            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors py-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out and sign in later
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-600">
            Having trouble? Contact us at support@qrazy.app
          </p>
        </div>
      </motion.div>
    </div>
  );
}