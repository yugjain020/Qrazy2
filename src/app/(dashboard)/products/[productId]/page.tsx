'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { getProductById } from '@/lib/firebase/firestore';
import ProductForm from '@/components/products/ProductForm';
import ARGenerationButton from '@/components/products/ARGenerationButton';

export default function EditProductPage() {
  const params = useParams();
  const { workspace, verticalConfig } = useBusinessVertical();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProduct = async () => {
    try {
      const data = await getProductById(params.productId as string);
      if (!data) {
        setError('Product not found');
        return;
      }
      setProduct(data);
    } catch {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/products" className="btn-secondary">
          Go Back
        </Link>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Product Form */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Edit {verticalConfig.productLabels.singular}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Update your {verticalConfig.productLabels.singular.toLowerCase()} details and image.
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <ProductForm
              mode="edit"
              initialData={{
                productId: product.id,
                name: product.name,
                description: product.description,
                imageUrl: product.imageUrl,
                verticalMetadata: product.verticalMetadata,
              }}
            />
          </div>
        </div>

        {/* Right: AR Generation Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {verticalConfig.arExperienceLabel}
              </h2>
              
              {/* Image Preview */}
              {product.imageUrl && (
                <div className="aspect-video bg-gray-100 dark:bg-dark-surface rounded-xl overflow-hidden mb-4 border border-gray-200 dark:border-dark-border">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* AR Generation Button */}
              {workspace?.workspaceId && (
                <ARGenerationButton
                  productId={product.id}
                  workspaceId={workspace.workspaceId}
                  imageUrl={product.imageUrl}
                  hasExistingGLB={!!product.glbUrl}
                  onGenerated={fetchProduct} // Refresh product data to update button state
                />
              )}

              {/* Vertical Geometry Info */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">3D Template:</span>{' '}
                  {verticalConfig.geometryTemplate === 'plate' ? 'Circular Plate' :
                   verticalConfig.geometryTemplate === 'box' ? '3D Box' :
                   verticalConfig.geometryTemplate === 'ring' ? 'Torus Ring' :
                   verticalConfig.geometryTemplate === 'building' ? 'Tall Building' :
                   'Flat Card'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}