'use client';

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
  X,
  Sparkles,
} from 'lucide-react';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { cn } from '@/lib/utils/cn';
import { BUSINESS_TYPES } from '@/lib/verticals/config';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { businessType, verticalConfig } = useBusinessVertical();
  const businessInfo = BUSINESS_TYPES.find((bt) => bt.id === businessType);

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: verticalConfig.productLabels.plural, href: '/products', icon: Box },
    { name: 'QR Manager', href: '/qr-manager', icon: ScanLine },
    { name: verticalConfig.arExperienceLabel, href: '/ar-viewer', icon: Eye },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'AI Assistant', href: '/ai-assistant', icon: Bot },
    { name: 'Template Library', href: '/template-library', icon: BookTemplate },
  ];

  const bottomNavItems: NavItem[] = [
    { name: 'Workspace', href: '/workspace', icon: Building2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
                  QRAZY
                </span>
                {businessInfo && (
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r text-white font-semibold',
                      businessInfo.gradient
                    )}
                  >
                    {businessInfo.name}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                      active
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 flex-shrink-0',
                        active
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-gray-400 dark:text-gray-500'
                      )}
                    />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* AI Tip */}
            <div className="px-3 mb-3">
              <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                    Pro Tip
                  </span>
                </div>
                <p className="text-[11px] text-brand-600 dark:text-brand-400 leading-relaxed">
                  Upload your first {verticalConfig.productLabels.singular.toLowerCase()} to get started!
                </p>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="py-4 px-3 space-y-1 border-t border-gray-200 dark:border-dark-border">
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                      active
                        ? 'bg-gray-100 dark:bg-dark-surface text-gray-900 dark:text-white font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}