'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Trash2, ScanLine, ExternalLink, Loader2, QrCode } from 'lucide-react';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { getQRCodesByWorkspace, deleteQRCode, getProductsByWorkspace } from '@/lib/firebase/firestore';
import { downloadDataURL } from '@/lib/qrcode';
import CreateQRModal from '@/components/qr/CreateQRModal';
import toast from 'react-hot-toast';

export default function QRManagerPage() {
  const { workspace, verticalConfig } = useBusinessVertical();
  const [qrcodes, setQrcodes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    if (!workspace?.workspaceId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [qrData, productData] = await Promise.all([
        getQRCodesByWorkspace(workspace.workspaceId),
        getProductsByWorkspace(workspace.workspaceId),
      ]);
      setQrcodes(qrData);
      setProducts(productData);
    } catch (error) {
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [workspace?.workspaceId]);

  const handleDelete = async (qrcodeId: string) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return;

    try {
      await deleteQRCode(qrcodeId);
      setQrcodes((prev) => prev.filter((qr) => qr.id !== qrcodeId));
      toast.success('QR Code deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleDownload = (qrImageUrl: string, productName: string) => {
    const filename = `qrazy-${productName.toLowerCase().replace(/\s+/g, '-')}.png`;
    downloadDataURL(qrImageUrl, filename);
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getProductImage = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.imageUrl || null;
  };

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
            QR Manager
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Generate and manage QR codes for your {verticalConfig.arExperienceLabel} experiences
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          Generate QR Code
        </button>
      </div>

      {/* Empty State */}
      {qrcodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-purple-50 dark:bg-purple-900/30 mx-auto flex items-center justify-center mb-4">
            <QrCode className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No QR codes yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Generate your first QR code to link physical locations to your {verticalConfig.arExperienceLabel} experiences.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate QR Code
          </button>
        </motion.div>
      )}

      {/* QR Codes Grid */}
      {qrcodes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {qrcodes.map((qr, i) => {
            const productName = getProductName(qr.productId);
            const productImage = getProductImage(qr.productId);

            return (
              <motion.div
                key={qr.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden group"
              >
                <div className="p-5 flex flex-col items-center text-center">
                  {/* QR Code Image with floating animation */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="mb-4 p-3 bg-white rounded-xl shadow-sm"
                  >
                    <img
                      src={qr.qrImageUrl}
                      alt={`QR for ${productName}`}
                      className="w-40 h-40 object-contain"
                    />
                  </motion.div>

                  {/* Product Info */}
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white mb-1 truncate w-full">
                    {productName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <ScanLine className="w-3.5 h-3.5" />
                    {qr.scanCount || 0} scans
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => handleDownload(qr.qrImageUrl, productName)}
                      className="flex-1 btn-secondary text-xs !py-2 flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                    <a
                      href={qr.linkedArUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(qr.id)}
                      className="p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create QR Modal */}
      <CreateQRModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchData}
      />
    </div>
  );
}