'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import ProductForm from '@/components/products/ProductForm';

export default function NewProductPage() {
  const { verticalConfig } = useBusinessVertical();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {verticalConfig.productLabels.plural}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
          Add New {verticalConfig.productLabels.singular}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload an image and fill in the details to create your {verticalConfig.arExperienceLabel.toLowerCase()} experience.
        </p>
      </div>

      {/* Form */}
      <div className="glass-card p-6 sm:p-8">
        <ProductForm mode="create" />
      </div>
    </motion.div>
  );
}