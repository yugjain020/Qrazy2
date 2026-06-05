import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { type BusinessType, type UserProfile, type Workspace } from '@/types';
import { generateId } from '@/lib/utils/date';

// ---------- User Operations ----------

export async function createUserProfile(
  uid: string,
  data: {
    email: string;
    displayName: string;
    photoURL?: string | null;
    workspaceId: string;
  }
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const userProfile: Omit<UserProfile, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL || null,
    emailVerified: false,
    workspaceId: data.workspaceId,
    themePreference: 'system',
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, userProfile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as UserProfile;
}

export async function updateUserThemePreference(
  uid: string,
  themePreference: 'light' | 'dark' | 'system'
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { themePreference }, { merge: true });
}

// ---------- Workspace Operations ----------

export async function createWorkspace(
  workspaceId: string,
  data: {
    ownerId: string;
    workspaceName: string;
    businessType: BusinessType;
  }
): Promise<void> {
  const workspaceRef = doc(db, 'workspaces', workspaceId);
  const workspace: Omit<Workspace, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    workspaceId,
    ownerId: data.ownerId,
    workspaceName: data.workspaceName,
    businessType: data.businessType,
    brandingConfig: {
      primaryColor: '#4c6ef5',
      logoUrl: null,
      companyName: data.workspaceName,
    },
    createdAt: serverTimestamp(),
  };

  await setDoc(workspaceRef, workspace);
}

export async function getWorkspace(workspaceId: string): Promise<Workspace | null> {
  const workspaceRef = doc(db, 'workspaces', workspaceId);
  const workspaceSnap = await getDoc(workspaceRef);

  if (!workspaceSnap.exists()) {
    return null;
  }

  return workspaceSnap.data() as Workspace;
}

// Add this alongside your other workspace functions

export async function updateWorkspaceBusinessType(
  workspaceId: string,
  businessType: BusinessType
): Promise<void> {
  const workspaceRef = doc(db, 'workspaces', workspaceId);
  await setDoc(workspaceRef, { businessType }, { merge: true });
}

// ---------- Combined Setup (Called on Signup) ----------

export async function setupNewUser(
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string | null
): Promise<string> {
  // 1. Get business type from localStorage (set during onboarding)
  let businessType: BusinessType = 'general';
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('qrazy-business-type');
    if (stored) {
      businessType = stored as BusinessType;
      localStorage.removeItem('qrazy-business-type'); // Clean up after reading
    }
  }

  // 2. Generate workspace ID
  const workspaceId = `ws-${generateId()}`;

  // 3. Create workspace
  await createWorkspace(workspaceId, {
    ownerId: uid,
    workspaceName: `${displayName}'s Workspace`,
    businessType,
  });

  // 4. Create user profile
  await createUserProfile(uid, {
    email,
    displayName,
    photoURL: photoURL || null,
    workspaceId,
  });

  return workspaceId;
}