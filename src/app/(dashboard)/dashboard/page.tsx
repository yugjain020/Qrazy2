'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import { QrCode, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userProfile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Simple Navbar for now */}
      <nav className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
              QRAZY
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content Placeholder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {userProfile?.displayName || 'User'} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your dashboard is being built. Full dashboard coming on Day 8-9!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">
                Products
              </h3>
              <p className="text-3xl font-bold gradient-text">0</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Coming on Day 10
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">
                QR Codes
              </h3>
              <p className="text-3xl font-bold gradient-text">0</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Coming on Day 12
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1">
                AR Views
              </h3>
              <p className="text-3xl font-bold gradient-text">0</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Coming on Day 16
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 glass-card p-6">
            <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-4">
              Build Progress
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Authentication', status: '✅ Complete' },
                { name: 'Dashboard', status: '🔄 In Progress' },
                { name: 'Products Module', status: '⏳ Upcoming' },
                { name: 'QR Generator', status: '⏳ Upcoming' },
                { name: 'AR Pipeline', status: '⏳ Upcoming' },
                { name: 'Analytics', status: '⏳ Upcoming' },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-border last:border-0"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}