'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  QrCode,
  ArrowRight,
  ArrowLeft,
  Check,
  UtensilsCrossed,
  ShoppingBag,
  Armchair,
  Gem,
  Building2,
  Car,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { BUSINESS_TYPES } from '@/lib/verticals/config';
import { type BusinessType } from '@/types';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  ShoppingBag,
  Armchair,
  Gem,
  Building2,
  Car,
  Briefcase,
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function SelectBusinessPage() {
  const [selectedType, setSelectedType] = useState<BusinessType | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // Check if user already selected a type before
  useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('qrazy-business-type');
      if (stored) {
        setSelectedType(stored as BusinessType);
      }
    }
  });

  const handleSelect = (type: BusinessType) => {
    setSelectedType(type);
    localStorage.setItem('qrazy-business-type', type);
  };

  const handleContinue = () => {
    if (!selectedType) return;

    setIsNavigating(true);

    // Small delay for animation
    setTimeout(() => {
      router.push('/signup');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-transparent to-purple-50/30 dark:from-brand-900/10 dark:via-transparent dark:to-purple-900/10 pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-gray-200/50 dark:border-dark-border/50 bg-white/70 dark:bg-dark-bg/70 backdrop-blur-xl">
          <div className="section-container flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                QRAZY
              </span>
            </Link>

            <Link
              href="/login"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Already have an account?{' '}
              <span className="font-semibold">Sign in</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800/50 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-medium text-brand-700 dark:text-brand-300">
                  Personalized Experience
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                What&apos;s Your{' '}
                <span className="gradient-text">Business Type</span>?
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                We&apos;ll customize your QRAZY experience based on your industry —
                from dashboard widgets to AR templates to analytics.
              </p>
            </motion.div>

            {/* Business Type Grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10"
            >
              {BUSINESS_TYPES.map((bt) => {
                const IconComponent = iconMap[bt.icon] || Briefcase;
                const isSelected = selectedType === bt.id;

                return (
                  <motion.button
                    key={bt.id}
                    variants={cardVariant}
                    whileHover={{
                      scale: 1.03,
                      rotateY: 3,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(bt.id)}
                    className={cn(
                      'perspective-1000 group relative',
                    )}
                  >
                    <div
                      className={cn(
                        'preserve-3d glass-card p-5 text-center transition-all duration-300 h-full',
                        isSelected
                          ? 'ring-2 ring-brand-500 dark:ring-brand-400 bg-brand-50/80 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700 shadow-lg shadow-brand-500/10'
                          : 'hover:shadow-md hover:border-gray-300 dark:hover:border-dark-hover'
                      )}
                    >
                      {/* Selected Checkmark */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center"
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          'w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110',
                          isSelected
                            ? `bg-gradient-to-br ${bt.gradient} shadow-md`
                            : `bg-gradient-to-br ${bt.gradient} opacity-70 group-hover:opacity-100`
                        )}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>

                      {/* Name */}
                      <h3
                        className={cn(
                          'font-display font-semibold text-sm mb-1 transition-colors',
                          isSelected
                            ? 'text-brand-700 dark:text-brand-300'
                            : 'text-gray-900 dark:text-white'
                        )}
                      >
                        {bt.name}
                      </h3>

                      {/* AR Label */}
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {bt.arExperienceLabel}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/"
                className="btn-secondary flex items-center gap-2 order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>

              <button
                onClick={handleContinue}
                disabled={!selectedType || isNavigating}
                className={cn(
                  'btn-primary flex items-center gap-2 order-1 sm:order-2 min-w-[200px] justify-center',
                  (!selectedType || isNavigating) &&
                    'opacity-50 cursor-not-allowed'
                )}
              >
                {isNavigating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Skip Option */}
            <p className="text-center mt-6">
              <button
                onClick={() => {
                  handleSelect('general');
                  router.push('/signup');
                }}
                className="text-sm text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors underline"
              >
                Skip for now — I&apos;ll set it up later
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}