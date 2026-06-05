'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { createProduct } from '@/lib/firebase/firestore';
import { type TemplateData, getTemplateById } from '@/lib/templates';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ApplyTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateData | null;
}

export default function ApplyTemplateModal({ isOpen, onClose, template }: ApplyTemplateModalProps) {
  const { user } = useAuth();
  const { workspace, verticalConfig } = useBusinessVertical();
  const [productName, setProductName] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const router = useRouter();

  if (!template) return null;

  const handleApply = async () => {
    if (!user || !workspace?.workspaceId || !productName.trim()) {
      toast.error('Please enter a name for your ' + verticalConfig.productLabels.singular.toLowerCase());
      return;
    }

    try {
      setIsApplying(true);

      // Create a product using the template's defaults
      const productId = await createProduct(
        workspace.workspaceId,
        user.uid,
        {
          name: productName.trim(),
          description: `Created from template: ${template.name}. ${template.description}`,
          imageUrl: '', // User will upload their own image
          verticalMetadata: {
            ...template.defaultMetadata,
            templateUsed: template.name,
          },
        }
      );

      toast.success(`${verticalConfig.productLabels.singular} created from template!`);
      router.push(`/products/${productId}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to apply template');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
                      Apply Template
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {template.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Template Preview */}
                <div className={`p-4 rounded-xl bg-gradient-to-br ${template.gradient} bg-opacity-10`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-white bg-black/20 px-2 py-0.5 rounded-md">
                      {template.geometryType.toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-white/80">
                      3D Model Type
                    </span>
                  </div>
                  <p className="text-sm text-white/90">
                    {template.description}
                  </p>
                </div>

                {/* Product Name Input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {verticalConfig.productLabels.singular} Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={`e.g., My ${verticalConfig.productLabels.singular}`}
                    className="input-field"
                    autoFocus
                  />
                </div>

                {/* Info Text */}
                <div className="bg-gray-50 dark:bg-dark-surface rounded-xl p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    📝 This will create a new {verticalConfig.productLabels.singular.toLowerCase()} with the template's default settings. You can customize it further after creation, including uploading your own image and generating the AR model.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-dark-border">
                <button onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={!productName.trim() || isApplying}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Create from Template
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}