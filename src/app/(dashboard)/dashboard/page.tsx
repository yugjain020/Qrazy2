'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import {
  Box,
  Eye,
  BarChart3,
  ArrowRight,
  Plus,
  ScanLine,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { BUSINESS_TYPES } from '@/lib/verticals/config';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const { businessType, verticalConfig, workspace } = useBusinessVertical();
  const businessInfo = BUSINESS_TYPES.find((bt) => bt.id === businessType);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Welcome Header */}
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome back, {userProfile?.displayName || 'User'} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here&apos;s what&apos;s happening with your{' '}
          {verticalConfig.productLabels.singular.toLowerCase()} today.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        {[
          {
            label: `Total ${verticalConfig.productLabels.plural}`,
            value: '0',
            icon: Box,
            color: 'blue',
            bgColor: 'bg-blue-50 dark:bg-blue-900/30',
            textColor: 'text-blue-600 dark:text-blue-400',
          },
          {
            label: `${verticalConfig.arExperienceLabel} Launches`,
            value: '0',
            icon: Eye,
            color: 'purple',
            bgColor: 'bg-purple-50 dark:bg-purple-900/30',
            textColor: 'text-purple-600 dark:text-purple-400',
          },
          {
            label: verticalConfig.analyticsKPILabels.scans,
            value: '0',
            icon: ScanLine,
            color: 'emerald',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
            textColor: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            label: 'Conversion Rate',
            value: '0%',
            icon: BarChart3,
            color: 'amber',
            bgColor: 'bg-amber-50 dark:bg-amber-900/30',
            textColor: 'text-amber-600 dark:text-amber-400',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            whileHover={{
              rotateY: 5,
              rotateX: -5,
              transition: { duration: 0.2 },
            }}
            className="perspective-1000"
          >
            <div className="glass-card-hover p-5 preserve-3d">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Workspace Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/products"
                className="flex items-center gap-3 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
                    Add {verticalConfig.productLabels.singular}
                  </p>
                  <p className="text-xs text-brand-600/60 dark:text-brand-400/60">
                    Upload a new item
                  </p>
                </div>
              </Link>

              <Link
                href="/qr-manager"
                className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <ScanLine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Generate QR
                  </p>
                  <p className="text-xs text-purple-600/60 dark:text-purple-400/60">
                    Create a QR code
                  </p>
                </div>
              </Link>

              <Link
                href="/ai-assistant"
                className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Ask AI
                  </p>
                  <p className="text-xs text-emerald-600/60 dark:text-emerald-400/60">
                    Get recommendations
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Workspace Info */}
        <motion.div variants={fadeInUp}>
          <div className="glass-card p-6 h-full">
            <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Workspace
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate ml-2">
                  {workspace?.workspaceName || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {businessInfo?.name || 'General'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">AR Mode</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {verticalConfig.arExperienceLabel}
                </span>
              </div>
            </div>
            <Link
              href="/workspace"
              className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors mt-4"
            >
              Manage workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}