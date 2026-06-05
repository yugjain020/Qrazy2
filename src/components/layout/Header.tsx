'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  Monitor,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { cn } from '@/lib/utils/cn';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, userProfile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-dark-surface rounded-xl px-3 py-2 w-64 border border-transparent focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none w-full"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <div ref={themeRef} className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg overflow-hidden z-50"
              >
                {[
                  { value: 'light' as const, icon: Sun, label: 'Light' },
                  { value: 'dark' as const, icon: Moon, label: 'Dark' },
                  { value: 'system' as const, icon: Monitor, label: 'System' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value);
                      setShowThemeMenu(false);
                    }}
                    className={cn(
                      'flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors',
                      theme === option.value
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface'
                    )}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <span className="text-white text-sm font-semibold">
                  {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
              {userProfile?.displayName || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg overflow-hidden z-50"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {userProfile?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-dark-border py-1">
                  <button
                    onClick={async () => {
                      setShowProfileMenu(false);
                      await signOut();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}