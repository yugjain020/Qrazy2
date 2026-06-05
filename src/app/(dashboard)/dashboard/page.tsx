'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import {
  QrCode,
  LogOut,
  Box,
  BarChart3,
  Eye,
  Moon,
  Sun,
  Monitor,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { BUSINESS_TYPES } from '@/lib/verticals/config';

export default function DashboardPage() {
  const { user, userProfile, signOut } = useAuth();
  const { businessType, verticalConfig, workspace, loading: verticalLoading } = useBusinessVertical();
  const { theme, setTheme, resolvedTheme } = useTheme();

  if (verticalLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const businessInfo = BUSINESS_TYPES.find((bt) => bt.id === businessType);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Navbar */}
      <nav className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
              QRAZY
            </span>
            {businessInfo && (
              <span className={cn('text-xs px-2 py-1 rounded-full bg-gradient-to-r text-white font-medium', businessInfo.gradient)}>
                {businessInfo.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle (Mini) */}
            <div className="flex items-center bg-gray-100 dark:bg-dark-surface rounded-lg p-1">
              <button onClick={() => setTheme('light')} className={cn('p-1 rounded-md', theme === 'light' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-400')}>
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setTheme('dark')} className={cn('p-1 rounded-md', theme === 'dark' ? 'bg-dark-card shadow-sm text-brand-400' : 'text-gray-400')}>
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setTheme('system')} className={cn('p-1 rounded-md', theme === 'system' ? 'bg-white dark:bg-dark-card shadow-sm text-brand-500' : 'text-gray-400')}>
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome back, {userProfile?.displayName || 'User'} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Here&apos;s what&apos;s happening with your {verticalConfig.productLabels.singular.toLowerCase()} today.
          </p>

          {/* Personalized Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              whileHover={{ rotateY: 5, rotateX: -5, transition: { duration: 0.2 } }}
              className="perspective-1000"
            >
              <div className="glass-card-hover p-6 preserve-3d">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Box className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total {verticalConfig.productLabels.plural}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ rotateY: 5, rotateX: -5, transition: { duration: 0.2 } }}
              className="perspective-1000"
            >
              <div className="glass-card-hover p-6 preserve-3d">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {verticalConfig.arExperienceLabel} Launches
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ rotateY: 5, rotateX: -5, transition: { duration: 0.2 } }}
              className="perspective-1000"
            >
              <div className="glass-card-hover p-6 preserve-3d">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {verticalConfig.analyticsKPILabels.scans}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </motion.div>
          </div>

          {/* Workspace & Vertical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">
                Workspace Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Workspace</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {workspace?.workspaceName || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Business Type</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {businessInfo?.name || 'General'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">AR Experience</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {verticalConfig.arExperienceLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">
                Product Form Fields
              </h3>
              <div className="space-y-2">
                {verticalConfig.productFormFields.map((field) => (
                  <div key={field.name} className="flex items-center gap-2 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{field.label}</span>
                    {field.required && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium">
                        Required
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}