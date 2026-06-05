'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const { resendEmailVerification, user, signOut } = useAuth();
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    try {
      setIsResending(true);
      await resendEmailVerification();
      toast.success('Verification email sent!');
    } catch {
      toast.error('Failed to send verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 sm:p-12 max-w-md w-full text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/30 mx-auto flex items-center justify-center">
          <Mail className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            We&apos;ve sent a verification link to{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {user?.email || 'your email'}
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isResending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Resend Verification Email'
            )}
          </button>

          <button
            onClick={signOut}
            className="btn-secondary w-full"
          >
            Sign Out
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-500">
          After verifying your email,{' '}
          <Link href="/login" className="text-brand-600 dark:text-brand-400 hover:underline">
            click here to sign in
            <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
}