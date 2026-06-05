'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  LayoutDashboard,
  Box,
  ScanLine,
  Eye,
  BarChart3,
  Bot,
  Building2,
  Settings,
  BookTemplate,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { cn } from '@/lib/utils/cn';
import { BUSINESS_TYPES } from '@/lib/verticals/config';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  verticalLabel?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { businessType, verticalConfig } = useBusinessVertical();

  const businessInfo = BUSINESS_TYPES.find((bt) => bt.id === businessType);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: verticalConfig.productLabels.plural,
      href: '/products',
      icon: Box,
      verticalLabel: verticalConfig.productLabels.plural,
    },
    {
      name: 'QR Manager',
      href: '/qr-manager',
      icon: ScanLine,
    },
    {
      name: verticalConfig.arExperienceLabel,
      href: '/ar-viewer',
      icon: Eye,
      verticalLabel: verticalConfig.arExperienceLabel,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      verticalLabel: verticalConfig.analyticsKPILabels.scans,
    },
    {
      name: 'AI Assistant',
      href: '/ai-assistant',
      icon: Bot,
    },
    {
      name: 'Template Library',
      href: '/template-library',
      icon: BookTemplate,
    },
  ];

  const bottomNavItems: NavItem[] = [
    {
      name: 'Workspace',
      href: '/workspace',
      icon: Building2,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="hidden lg:flex flex-col bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border h-screen sticky top-0 overflow-hidden"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-gray-200 dark:border-dark-border flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <QrCode className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap">
                QRAZY
              </span>
              {businessInfo && (
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r text-white font-semibold whitespace-nowrap',
                    businessInfo.gradient
                  )}
                >
                  {businessInfo.name}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                active
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-500 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <Icon
                className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  active
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                )}
              />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 px-3 space-y-1 border-t border-gray-200 dark:border-dark-border">
        {/* AI Tip */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                  Pro Tip
                </span>
              </div>
              <p className="text-[11px] text-brand-600 dark:text-brand-400 leading-relaxed">
                Upload your first {verticalConfig.productLabels.singular.toLowerCase()} to generate an {verticalConfig.arExperienceLabel} instantly!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                active
                  ? 'bg-gray-100 dark:bg-dark-surface text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 flex-shrink-0',
                  active
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                )}
              />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-center h-12 border-t border-gray-200 dark:border-dark-border text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
}