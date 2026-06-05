'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Palette, 
  Shield, 
  Bell, 
  Camera, 
  Save, 
  Loader2,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import { updateUserProfile, uploadProfilePicture } from '@/lib/firebase/firestore';
import { updateProfile } from 'firebase/auth';
import ThemeSelector from '@/components/settings/ThemeSelector';
import { cn } from '@/lib/utils/cn';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, userProfile, signOut } = useAuth();
  const { workspace } = useBusinessVertical();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async () => {
    if (!user || !displayName.trim()) return;

    try {
      setIsSavingProfile(true);
      
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: displayName.trim() });
      
      // Update Firestore profile
      await updateUserProfile(user.uid, { displayName: displayName.trim() });
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      
      const photoURL = await uploadProfilePicture(file, user.uid);
      
      await updateProfile(user, { photoURL });
      await updateUserProfile(user.uid, { photoURL });
      
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-500" />
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account preferences and workspace settings
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="md:w-48 flex-shrink-0">
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all whitespace-nowrap',
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Avatar */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Profile Picture
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center overflow-hidden">
                        {userProfile?.photoURL ? (
                          <img
                            src={userProfile.photoURL}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-2xl font-bold">
                            {displayName?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-md hover:bg-brand-600 transition-colors"
                      >
                        {isUploadingAvatar ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Camera className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Click the camera icon to upload a new photo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Display Name
                  </h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input-field flex-1"
                      placeholder="Enter your display name"
                    />
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile || !displayName.trim()}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                  </div>
                </div>

                {/* Account Info */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Email Verified</span>
                      <span className={cn(
                        'text-sm font-medium',
                        user?.emailVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      )}>
                        {user?.emailVerified ? 'Yes' : 'Not verified'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Workspace</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{workspace?.workspaceName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Account Created</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.metadata?.creationTime 
                          ? new Date(user.metadata.creationTime).toLocaleDateString() 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Theme
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Choose how QRAZY looks on your screen. Your preference is synced across devices.
                </p>
                <ThemeSelector />
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Security Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-border">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Email Verification</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Verify your email for full dashboard access
                        </p>
                      </div>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-lg font-medium',
                        user?.emailVerified 
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      )}>
                        {user?.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-border">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Auto Logout</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Automatically sign out after 30 minutes of inactivity
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium">
                        Enabled
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Multi-Tab Sync</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Signing out on one tab signs out all tabs
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium">
                        Enabled
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    These actions are irreversible. Please proceed with caution.
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notification Preferences
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Manage how you receive notifications from QRAZY.
                </p>
                <div className="space-y-4">
                  {[
                    { label: 'QR Code Scans', description: 'Get notified when someone scans your QR code', enabled: true },
                    { label: 'AR Launches', description: 'Get notified when someone launches your AR experience', enabled: true },
                    { label: 'Weekly Analytics Report', description: 'Receive a weekly summary of your AR performance', enabled: false },
                    { label: 'Product Updates', description: 'Get notified about new QRAZY features', enabled: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                      <div className={cn(
                        'w-10 h-6 rounded-full transition-colors cursor-pointer relative',
                        item.enabled ? 'bg-brand-500' : 'bg-gray-300 dark:bg-dark-border'
                      )}>
                        <div className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
                          item.enabled ? 'translate-x-5' : 'translate-x-1'
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                  💡 Notification emails will be sent to {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}