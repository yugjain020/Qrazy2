'use client';

import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { cn } from '@/lib/utils/cn';

export default function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: Sun,
      description: 'Clean and bright',
      preview: (
        <div className="w-full h-24 rounded-lg bg-white border border-gray-200 p-2 flex flex-col gap-1.5">
          <div className="w-8 h-1.5 rounded bg-gray-300" />
          <div className="w-12 h-1.5 rounded bg-gray-200" />
          <div className="flex gap-1 mt-1">
            <div className="w-4 h-4 rounded bg-brand-200" />
            <div className="w-4 h-4 rounded bg-purple-200" />
            <div className="w-4 h-4 rounded bg-pink-200" />
          </div>
        </div>
      ),
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes',
      preview: (
        <div className="w-full h-24 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] p-2 flex flex-col gap-1.5">
          <div className="w-8 h-1.5 rounded bg-gray-700" />
          <div className="w-12 h-1.5 rounded bg-gray-800" />
          <div className="flex gap-1 mt-1">
            <div className="w-4 h-4 rounded bg-brand-900" />
            <div className="w-4 h-4 rounded bg-purple-900" />
            <div className="w-4 h-4 rounded bg-pink-900" />
          </div>
        </div>
      ),
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: Monitor,
      description: 'Matches your OS',
      preview: (
        <div className="w-full h-24 rounded-lg flex overflow-hidden border border-gray-200 dark:border-dark-border">
          <div className="w-1/2 bg-white p-2 flex flex-col gap-1">
            <div className="w-6 h-1 rounded bg-gray-300" />
            <div className="w-8 h-1 rounded bg-gray-200" />
          </div>
          <div className="w-1/2 bg-[#0a0a0f] p-2 flex flex-col gap-1">
            <div className="w-6 h-1 rounded bg-gray-700" />
            <div className="w-8 h-1 rounded bg-gray-800" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.value;

        return (
          <motion.button
            key={t.value}
            onClick={() => setTheme(t.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all text-left',
              isActive
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20 shadow-lg shadow-brand-500/10'
                : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-hover bg-white dark:bg-dark-surface'
            )}
          >
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <Icon
                className={cn(
                  'w-4 h-4',
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-semibold',
                  isActive
                    ? 'text-brand-700 dark:text-brand-300'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {t.label}
              </span>
            </div>

            {t.preview}

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}