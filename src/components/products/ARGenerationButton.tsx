'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { generateGLBFromImage, type GeometryTemplate } from '@/lib/ar-pipeline';
import { uploadGLBToStorage, updateProductGLBUrl } from '@/lib/firebase/firestore';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import toast from 'react-hot-toast';

interface ARGenerationButtonProps {
  productId: string;
  workspaceId: string;
  imageUrl: string;
  hasExistingGLB: boolean;
  onGenerated: () => void;
}

export default function ARGenerationButton({
  productId,
  workspaceId,
  imageUrl,
  hasExistingGLB,
  onGenerated,
}: ARGenerationButtonProps) {
  const { verticalConfig } = useBusinessVertical();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!imageUrl) {
      toast.error('Product must have an image to generate AR');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      
      // 1. Generate GLB in the browser
      const geometryType = (verticalConfig.geometryTemplate || 'plane') as GeometryTemplate;
      const glbBuffer = await generateGLBFromImage(imageUrl, geometryType, (status) => {
        setProgressText(status);
      });

      // 2. Upload to Firebase Storage
      setProgressText('Uploading 3D model to cloud...');
      const glbUrl = await uploadGLBToStorage(glbBuffer, workspaceId, productId);

      // 3. Update Firestore
      setProgressText('Finalizing...');
      await updateProductGLBUrl(productId, glbUrl);

      toast.success('3D AR Model generated successfully!');
      onGenerated();
    } catch (err) {
      console.error(err);
      setError('Failed to generate 3D model. Please try again.');
      toast.error('Generation failed');
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  return (
    <div className="space-y-3">
      {hasExistingGLB && !isGenerating && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>3D AR Model ready</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !imageUrl}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {progressText || 'Processing...'}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {hasExistingGLB ? 'Regenerate AR Model' : `Generate ${verticalConfig.arExperienceLabel}`}
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        {!imageUrl 
          ? 'Upload an image first to enable AR generation'
          : 'Converts your image into a 3D model using our proprietary pipeline'
        }
      </p>
    </div>
  );
}