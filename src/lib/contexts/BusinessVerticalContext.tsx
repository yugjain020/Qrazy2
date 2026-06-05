'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getWorkspace, updateWorkspaceBusinessType } from '@/lib/firebase/firestore';
import { getVerticalConfig } from '@/lib/verticals/config';
import { type BusinessType, type VerticalConfig, type Workspace } from '@/types';

interface BusinessVerticalContextType {
  businessType: BusinessType;
  verticalConfig: VerticalConfig;
  workspace: Workspace | null;
  loading: boolean;
  setBusinessType: (type: BusinessType) => Promise<void>;
}

const BusinessVerticalContext = createContext<BusinessVerticalContextType | undefined>(undefined);

export function BusinessVerticalProvider({ children }: { children: ReactNode }) {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessType, setBusinessTypeState] = useState<BusinessType>('general');
  const [verticalConfig, setVerticalConfig] = useState<VerticalConfig>(getVerticalConfig('general'));

  // Fetch workspace data when user profile loads/changes
  useEffect(() => {
    const fetchWorkspace = async () => {
      // Wait for auth to finish and ensure we have a profile with a workspaceId
      if (authLoading || !userProfile?.workspaceId) {
        if (!authLoading && !userProfile) {
          setLoading(false); // Not logged in, stop loading
        }
        return;
      }

      try {
        setLoading(true);
        const workspaceData = await getWorkspace(userProfile.workspaceId);
        
        if (workspaceData) {
          setWorkspace(workspaceData);
          const bt = workspaceData.businessType || 'general';
          setBusinessTypeState(bt);
          setVerticalConfig(getVerticalConfig(bt));
        }
      } catch (error) {
        console.error('Error fetching workspace:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [authLoading, userProfile]);

  // Update business type in Firestore and refresh context
  const setBusinessType = useCallback(
    async (type: BusinessType) => {
      if (!workspace?.workspaceId) return;

      try {
        await updateWorkspaceBusinessType(workspace.workspaceId, type);
        setBusinessTypeState(type);
        setVerticalConfig(getVerticalConfig(type));
        setWorkspace((prev) => prev ? { ...prev, businessType: type } : null);
      } catch (error) {
        console.error('Error updating business type:', error);
        throw error;
      }
    },
    [workspace]
  );

  const value: BusinessVerticalContextType = {
    businessType,
    verticalConfig,
    workspace,
    loading,
    setBusinessType,
  };

  return (
    <BusinessVerticalContext.Provider value={value}>
      {children}
    </BusinessVerticalContext.Provider>
  );
}

export function useBusinessVertical() {
  const context = useContext(BusinessVerticalContext);
  if (!context) {
    throw new Error('useBusinessVertical must be used within a BusinessVerticalProvider');
  }
  return context;
}