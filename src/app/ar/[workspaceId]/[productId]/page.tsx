'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Loader2, 
  Box, 
  ArrowLeft, 
  Smartphone, 
  Monitor,
  Share2
} from 'lucide-react';
import { getProductById, getWorkspace, trackAnalyticsEvent, getDeviceType, generateSessionId } from '@/lib/firebase/firestore';
import { BUSINESS_TYPES } from '@/lib/verticals/config';
import ModelViewer from '@/components/ar/ModelViewer';

export default function ARProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionId] = useState(generateSessionId());
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    if (!params?.workspaceId || !params?.productId) {
      return; 
    }

    const fetchData = async () => {
      try {
        const productId = params.productId as string;
        const workspaceId = params.workspaceId as string;

        const [productData, workspaceData] = await Promise.all([
          getProductById(productId),
          getWorkspace(workspaceId),
        ]);

        if (!productData) {
          setError('Product not found. It may have been deleted.');
          return;
        }

        setProduct(productData);
        setWorkspace(workspaceData);

        try {
          await trackAnalyticsEvent({
            eventType: 'qr_scan',
            productId,
            workspaceId,
            deviceType: getDeviceType(),
            sessionId,
          });
        } catch (analyticsError) {
          console.warn('Failed to track analytics event:', analyticsError);
        }

      } catch (err: any) {
        console.error('Error fetching AR data:', err);
        if (err.code === 'permission-denied') {
          setError('Permission denied. Please check your Firestore Security Rules.');
        } else {
          setError('Failed to load AR experience. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleARLaunch = async () => {
    try {
      await trackAnalyticsEvent({
        eventType: 'ar_launch',
        productId: params.productId as string,
        workspaceId: params.workspaceId as string,
        deviceType: getDeviceType(),
        sessionId,
      });
    } catch {}
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Check this out!',
          text: `Experience ${product?.name} in AR!`,
          url,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-dark-bg dark:to-dark-surface">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center animate-pulse">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading AR Experience...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/30 mx-auto flex items-center justify-center mb-4">
            <Box className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
            Experience Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {error || 'This AR experience may have been removed or the link is incorrect.'}
          </p>
          <a
            href="https://qrazy.app"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to QRAZY
          </a>
        </motion.div>
      </div>
    );
  }

  const businessInfo = BUSINESS_TYPES.find((bt) => bt.id === workspace?.businessType);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Top Bar */}
      <header className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-border/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <QrCode className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-gray-900 dark:text-white">
              QRAZY
            </span>
            {businessInfo && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-medium hidden sm:inline">
                {businessInfo.arExperienceLabel}
              </span>
            )}
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* 3D Model Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="glass-card overflow-hidden">
              {product.glbUrl ? (
                <div className="relative">
                  <ModelViewer
                    ref={modelViewerRef}
                    src={product.glbUrl}
                    alt={product.name}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    environment-image="neutral"
                    auto-rotate
                    camera-controls
                    shadow-intensity="0.5"
                    exposure="1"
                    style={{ width: '100%', height: '500px', backgroundColor: 'transparent' }}
                  />

                  <button
                    onClick={handleARLaunch}
                    className="px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-brand-500/30 flex items-center gap-2 absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hover:from-brand-500 hover:to-brand-400 transition-all"
                  >
                    <Smartphone className="w-4 h-4" />
                    View in AR
                  </button>
                </div>
              ) : (
                <div className="h-[500px] flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-surface">
                  <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4">
                    <Box className="w-10 h-10 text-brand-500 dark:text-brand-400" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    3D Model Coming Soon
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    The AR experience is being generated. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass-card p-6">
              <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {product.description}
                </p>
              )}

              {product.verticalMetadata && Object.keys(product.verticalMetadata).length > 0 && (
                <div className="border-t border-gray-100 dark:border-dark-border pt-4 mt-4 space-y-2">
                  {Object.entries(product.verticalMetadata).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-3">
                How to View in AR
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: Smartphone,
                    title: 'On Mobile',
                    description: 'Tap "View in AR" to open the camera view and place the object in your space.',
                  },
                  {
                    icon: Monitor,
                    title: 'On Desktop',
                    description: 'Click and drag to rotate the 3D model. Scroll to zoom in/out.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {workspace && (
              <div className="glass-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {workspace.workspaceName?.charAt(0)?.toUpperCase() || 'Q'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {workspace.workspaceName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Powered by QRAZY AR
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}