'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
  getUserProfile,
  setupNewUser,
  updateUserThemePreference,
} from '@/lib/firebase/firestore';
import { type UserProfile, type ThemeOption } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateUserTheme: (theme: ThemeOption) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------- Listen to Auth State Changes ----------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);

        // If profile doesn't exist yet (first login after Google OAuth),
        // the profile will be created by the signup flow
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ---------- Email/Password Sign Up ----------
  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;

        // Update display name in Firebase Auth
        await updateProfile(firebaseUser, { displayName });

        // Send email verification
        await sendEmailVerification(firebaseUser);

        // Create user profile & workspace in Firestore
        await setupNewUser(firebaseUser.uid, email, displayName);

        // Fetch the newly created profile
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } catch (error: unknown) {
        const firebaseError = error as { code?: string; message?: string };
        throw new Error(getFirebaseErrorMessage(firebaseError.code || ''));
      }
    },
    []
  );

  // ---------- Email/Password Sign In ----------
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle fetching the profile
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      throw new Error(getFirebaseErrorMessage(firebaseError.code || ''));
    }
  }, []);

  // ---------- Google OAuth ----------
  const signInWithGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Always prompt to select account
      provider.setCustomParameters({ prompt: 'select_account' });

      const credential = await signInWithPopup(auth, provider);
      const firebaseUser = credential.user;

      // Check if this is a new user (no profile in Firestore yet)
      const existingProfile = await getUserProfile(firebaseUser.uid);

      if (!existingProfile) {
        // New user — create profile & workspace
        const displayName =
          firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';

        await setupNewUser(
          firebaseUser.uid,
          firebaseUser.email || '',
          displayName,
          firebaseUser.photoURL
        );

        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(existingProfile);
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      // Ignore popup-closed-by-user errors
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        return;
      }
      throw new Error(getFirebaseErrorMessage(firebaseError.code || ''));
    }
  }, []);

  // ---------- Sign Out ----------
  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
  }, []);

  // ---------- Password Reset ----------
  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      throw new Error(getFirebaseErrorMessage(firebaseError.code || ''));
    }
  }, []);

  // ---------- Resend Email Verification ----------
  const resendEmailVerification = useCallback(async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }, []);

  // ---------- Refresh User Profile ----------
  const refreshUserProfile = useCallback(async () => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    }
  }, [user]);

  // ---------- Update User Theme ----------
  const updateUserTheme = useCallback(
    async (theme: ThemeOption) => {
      if (user) {
        await updateUserThemePreference(user.uid, theme);
        setUserProfile((prev) =>
          prev ? { ...prev, themePreference: theme } : null
        );
      }
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    resendEmailVerification,
    refreshUserProfile,
    updateUserTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ---------- Firebase Error Message Mapper ----------
function getFirebaseErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/popup-blocked': 'Popup was blocked by your browser. Please allow popups and try again.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
    'auth/unauthorized-domain': 'This domain is not authorized for Google sign-in.',
  };

  return errorMessages[code] || 'An unexpected error occurred. Please try again.';
}