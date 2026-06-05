'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Save, Loader2, Palette, Store } from 'lucide-react';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { updateWorkspaceName } from '@/lib/firebase/firestore';
import { BUSINESS_TYPES } from '@/lib/verticals/config';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';

export default function WorkspacePage() {
  const { workspace, businessType, setBusinessType, verticalConfig } = useBusinessVertical();
  const [workspaceName, setWorkspaceName] = useState(workspace?.workspaceName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingType, setIsUpdatingType] = useState(false);

  const handleSaveName = async () => {
    if (!workspace?.workspaceId || !workspaceName.trim()) return;

    try {
      setIsSaving(true);
      await updateWorkspaceName(workspace.workspaceId, workspaceName.trim());
      toast.success('Workspace name updated!');
    } catch {
      toast.error('Failed to update workspace name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBusinessTypeChange = async (type: string) => {
    if (!workspace?.workspaceId || type === businessType) return;

    try {
      setIsUpdatingType(true);
      await setBusinessType(type as any);
      toast.success(`Business type updated to ${BUSINESS_TYPES.find(b => b.id === type)?.name}!`);
    } catch {
      toast.error('Failed to update business type');
    } finally {
      setIsUpdatingType(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-500" />
            Workspace Hub
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your workspace configuration and business settings
          </p>
        </div>

        {/* Workspace Overview Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">
                {workspaceName?.charAt(0)?.toUpperCase() || 'Q'}
              </span>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
                {workspace?.workspaceName || 'My Workspace'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {BUSINESS_TYPES.find(b => b.id === businessType)?.name || 'General'} • {verticalConfig.arExperienceLabel}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Business Type', value: BUSINESS_TYPES.find(b => b.id === businessType)?.name || 'General' },
              { label: 'Workspace ID', value: workspace?.workspaceId?.substring(0, 12) + '...' || 'N/A' },
              { label: 'AR Mode', value: verticalConfig.arExperienceLabel },
              { label: '3D Template', value: verticalConfig.geometryTemplate },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 dark:bg-dark-surface rounded-xl p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Name */}
        <div className="glass-card p-6 mb-6">
          <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Workspace Name
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="input-field flex-1"
              placeholder="Enter workspace name"
            />
            <button
              onClick={handleSaveName}
              disabled={isSaving || !workspaceName.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>

        {/* Business Type Selection */}
        <div className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Store className="w-5 h-5 text-brand-500" />
            Business Vertical
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Changing your business type will update dashboard labels, product form fields, and AR templates across your entire workspace.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {BUSINESS_TYPES.map((bt) => {
              const isActive = businessType === bt.id;
              const isUpdating = isUpdatingType;

              return (
                <button
                  key={bt.id}
                  onClick={() => handleBusinessTypeChange(bt.id)}
                  disabled={isUpdating}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all text-left relative',
                    isActive
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20'
                      : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-hover'
                  )}
                >
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                      <span className="text-white text-[8px]">✓</span>
                    </div>
                  )}
                  <span className="text-xl mb-1 block">
                    {bt.id === 'restaurant' ? '🍽️' :
                     bt.id === 'retail' ? '🛍️' :
                     bt.id === 'furniture' ? '🪑' :
                     bt.id === 'jewelry' ? '💎' :
                     bt.id === 'real_estate' ? '🏠' :
                     bt.id === 'automotive' ? '🚗' : '💼'}
                  </span>
                  <p className={cn(
                    'text-xs font-semibold',
                    isActive ? 'text-brand-700 dark:text-brand-300' : 'text-gray-900 dark:text-white'
                  )}>
                    {bt.name}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {bt.arExperienceLabel}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}