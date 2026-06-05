'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Palette } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { getProductsByWorkspace, createProduct } from '@/lib/firebase/firestore';
import { createQRCode } from '@/lib/firebase/firestore';
import { generateQRCodeDataURL, buildARUrl } from '@/lib/qrcode';
import toast from 'react-hot-toast';

interface CreateQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateQRModal({ isOpen, onClose, onCreated }: CreateQRModalProps) {
  const { user } = useAuth();
  const { workspace } = useBusinessVertical();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qrColor, setQrColor] = useState('#1e1e2e');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isOpen && workspace?.workspaceId) {
      getProductsByWorkspace(workspace.workspaceId).then(setProducts);
    }
  }, [isOpen, workspace]);

  useEffect(() => {
    if (selectedProductId && workspace?.workspaceId) {
      const url = buildARUrl(workspace.workspaceId, selectedProductId);
      generateQRCodeDataURL({ url, color: qrColor, backgroundColor: bgColor, size: 256 })
        .then(setPreviewUrl)
        .catch(() => setPreviewUrl(''));
    } else {
      setPreviewUrl('');
    }
  }, [selectedProductId, qrColor, bgColor, workspace]);

  const handleCreate = async () => {
    if (!user || !workspace?.workspaceId || !selectedProductId) {
      toast.error('Please select a product');
      return;
    }

    try {
      setIsGenerating(true);
      const linkedArUrl = buildARUrl(workspace.workspaceId, selectedProductId);
      const qrImageUrl = await generateQRCodeDataURL({
        url: linkedArUrl,
        color: qrColor,
        backgroundColor: bgColor,
        size: 512,
      });

      await createQRCode(workspace.workspaceId, user.uid, {
        productId: selectedProductId,
        linkedArUrl,
        qrImageUrl,
        style: { color: qrColor, backgroundColor: bgColor, logoUrl: null },
      });

      toast.success('QR Code generated successfully!');
      onCreated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
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
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
                <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
                  Generate QR Code
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Select Product */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Choose a product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {products.length === 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      No products found. Please create a product first.
                    </p>
                  )}
                </div>

                {/* Color Customization */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Palette className="w-4 h-4" />
                    Customize Colors
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Foreground</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="input-field text-xs !py-1.5"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="input-field text-xs !py-1.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Preview */}
                {previewUrl && (
                  <div className="flex justify-center p-4 bg-gray-50 dark:bg-dark-surface rounded-xl">
                    <motion.img
                      key={previewUrl}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={previewUrl}
                      alt="QR Preview"
                      className="w-48 h-48 object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-dark-border">
                <button onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!selectedProductId || isGenerating}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Generate QR Code'
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