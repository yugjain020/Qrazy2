'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowRight,
  QrCode,
  Box,
  BarChart3,
  Sparkles,
  ChevronRight,
  Zap,
  Shield,
  Globe,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { BUSINESS_TYPES } from '@/lib/verticals/config';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-dark-bg to-purple-900/20" />
  ),
});

// Simplified variant objects (TypeScript infers these automatically)
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }, // <-- FIXED
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden">
      {/* ========== NAVBAR ========== */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-border/50"
      >
        <div className="section-container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
              QRAZY
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Features
            </a>
            <a href="#verticals" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Industries
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <div className="flex items-center bg-gray-100 dark:bg-dark-surface rounded-lg p-1">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    theme === 'light'
                      ? 'bg-white dark:bg-dark-card shadow-sm text-brand-600'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  )}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    theme === 'dark'
                      ? 'bg-white dark:bg-dark-card shadow-sm text-brand-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  )}
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    theme === 'system'
                      ? 'bg-white dark:bg-dark-card shadow-sm text-brand-500'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  )}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Log In
            </Link>
            <Link href="/onboarding/select-business" className="btn-primary text-sm !px-4 !py-2">
              Get Started
              <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </Link>
          </div>
        </div>
      </motion.nav>

            {/* ========== HERO SECTION ========== */}
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-b from-brand-50 via-slate-50 to-slate-50 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg">
        <HeroScene />

        <div className="section-container relative z-10">
          {/* ... keep the rest of the hero text and buttons the same ... */}
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800/50 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-medium text-brand-700 dark:text-brand-300">
                  AI-Powered AR Commerce Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white mb-6"
            >
              Transform Products into{' '}
              <span className="gradient-text">AR Experiences</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl"
            >
              Upload a product image, generate a QR code, and let your customers
              experience products in augmented reality — no app download required.
              Zero-cost, zero-complexity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/onboarding/select-business"
                className="btn-primary text-base inline-flex items-center justify-center gap-2"
              >
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="btn-secondary text-base inline-flex items-center justify-center gap-2"
              >
                See How It Works
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Secure auth</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-500" />
                <span>Works globally</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="py-24 relative">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Everything You Need for AR Commerce
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              From product upload to AR deployment — QRAZY handles the entire pipeline
              with zero external dependencies.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                IconComponent: Box,
                title: 'Proprietary AR Pipeline',
                description:
                  'Convert product images to 3D AR models entirely in-house. No third-party APIs, no per-generation cost.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                IconComponent: QrCode,
                title: 'In-House QR Generation',
                description:
                  'Generate branded QR codes with custom styling. No external QR service — everything runs on your stack.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                IconComponent: Sparkles,
                title: 'AI Assistant',
                description:
                  'Get contextual business recommendations and AR optimization tips powered by Llama 3.3 70B via Groq.',
                color: 'from-orange-500 to-red-500',
              },
              {
                IconComponent: BarChart3,
                title: 'Real Analytics',
                description:
                  'Track every QR scan, AR launch, and engagement metric with real data — no fake counters or placeholders.',
                color: 'from-emerald-500 to-teal-500',
              },
              {
                IconComponent: Shield,
                title: 'Enterprise-Grade Security',
                description:
                  'Firebase Auth with email verification, session management, route protection, and Firestore security rules.',
                color: 'from-indigo-500 to-blue-500',
              },
              {
                IconComponent: Globe,
                title: 'Works on Every Device',
                description:
                  'AR launches natively on iOS (Quick Look), Android (Scene Viewer), and web browsers (WebXR) — no app needed.',
                color: 'from-pink-500 to-rose-500',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                custom={i}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-card-hover p-6 group"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300',
                    feature.color
                  )}
                >
                  <feature.IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== BUSINESS VERTICALS SECTION ========== */}
      <section id="verticals" className="py-24 bg-slate-100/80 dark:bg-dark-surface/50">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Built for Your Industry
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              QRAZY personalizes itself to your business — from dashboard labels to
              AR templates to analytics KPIs.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {BUSINESS_TYPES.map((bt, i) => (
              <motion.div
                key={bt.id}
                variants={fadeInUp}
                custom={i}
                whileHover={{
                  scale: 1.03,
                  rotateY: 5,
                  transition: { duration: 0.2 },
                }}
                className="perspective-1000"
              >
                <div className="glass-card-hover p-5 text-center preserve-3d cursor-pointer">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center',
                      bt.gradient
                    )}
                  >
                    <span className="text-2xl">
                      {bt.id === 'restaurant' ? '🍽️' :
                       bt.id === 'retail' ? '🛍️' :
                       bt.id === 'furniture' ? '🪑' :
                       bt.id === 'jewelry' ? '💎' :
                       bt.id === 'real_estate' ? '🏠' :
                       bt.id === 'automotive' ? '🚗' : '💼'}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {bt.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {bt.arExperienceLabel}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section id="how-it-works" className="py-24">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Three Steps to AR Commerce
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              No coding required. No app downloads. Just upload, generate, and deploy.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                title: 'Upload Your Product',
                description:
                  'Add your product with images and details. Our proprietary AR pipeline automatically converts it into a 3D model.',
                IconComponent: Box,
              },
              {
                step: '02',
                title: 'Generate QR Code',
                description:
                  'Create a branded QR code linked to your AR experience. Customize colors and add your logo.',
                IconComponent: QrCode,
              },
              {
                step: '03',
                title: 'Customers Experience AR',
                description:
                  'Customers scan the QR code and your product appears in AR — natively on any device, no app needed.',
                IconComponent: Globe,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                custom={i}
                className="relative"
              >
                <div className="glass-card p-8 text-center h-full">
                  <div className="text-5xl font-display font-bold gradient-text opacity-20 mb-4">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 mx-auto mb-4 flex items-center justify-center">
                    <item.IconComponent className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-brand-400/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 opacity-[0.07] dark:opacity-20" />
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              custom={0}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Ready to Go{' '}
              <span className="gradient-text">QRAZY</span>?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              custom={1}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8"
            >
              Start creating AR experiences for your business today. Free to start,
              no credit card required.
            </motion.p>
            <motion.div variants={fadeInUp} custom={2}>
              <Link
                href="/onboarding/select-business"
                className="btn-primary text-lg !px-8 !py-4 inline-flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 border-t border-gray-200 dark:border-dark-border">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <QrCode className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
                QRAZY
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} QRAZY. AI-Powered AR Commerce Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}