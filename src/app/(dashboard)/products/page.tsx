'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Plus, Search, MoreVertical, Edit, Trash2, Box, Eye, Loader2 } from 'lucide-react';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { getProductsByWorkspace, deleteProduct } from '@/lib/firebase/firestore';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { workspace, verticalConfig, businessType } = useBusinessVertical();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!workspace?.workspaceId) return;

    const fetchProducts = async () => {
      try {
        const data = await getProductsByWorkspace(workspace.workspaceId);
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [workspace]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success('Deleted successfully');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            {verticalConfig.productLabels.plural}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your {verticalConfig.productLabels.plural.toLowerCase()} and AR experiences
          </p>
        </div>
        <Link href="/products/new" className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Add {verticalConfig.productLabels.singular}
        </Link>
      </div>

      {/* Search Bar */}
      {products.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${verticalConfig.productLabels.plural.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-900/30 mx-auto flex items-center justify-center mb-4">
            <Box className="w-10 h-10 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No {verticalConfig.productLabels.plural} yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Add your first {verticalConfig.productLabels.singular.toLowerCase()} to start creating {verticalConfig.arExperienceLabel} experiences.
          </p>
          <Link href="/products/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add {verticalConfig.productLabels.singular}
          </Link>
        </motion.div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card-hover overflow-hidden group relative"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-100 dark:bg-dark-surface relative overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Box className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {product.description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(product.createdAt?.seconds * 1000).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/products/${product.id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No search results */}
      {products.length > 0 && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No {verticalConfig.productLabels.plural.toLowerCase()} found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}