import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
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

  await setDoc(userRef, userProfile, { merge: true });
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
  const workspace = {
    workspaceId, // Ensure the ID is saved inside the document
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

  // FIX: Explicitly merge the document ID to guarantee workspaceId is never undefined
  return { ...workspaceSnap.data(), workspaceId: workspaceSnap.id } as Workspace;
}

export async function updateWorkspaceBusinessType(
  workspaceId: string,
  businessType: BusinessType
): Promise<void> {
  const workspaceRef = doc(db, 'workspaces', workspaceId);
  await setDoc(workspaceRef, { businessType }, { merge: true });
}

// ---------- Combined Setup ----------

export async function setupNewUser(
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string | null
): Promise<string> {
  let businessType: BusinessType = 'general';
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('qrazy-business-type');
    if (stored) {
      businessType = stored as BusinessType;
      localStorage.removeItem('qrazy-business-type');
    }
  }

  const workspaceId = `ws-${generateId()}`;

  await createWorkspace(workspaceId, {
    ownerId: uid,
    workspaceName: `${displayName}'s Workspace`,
    businessType,
  });

  await createUserProfile(uid, {
    email,
    displayName,
    photoURL: photoURL || null,
    workspaceId,
  });

  return workspaceId;
}

// ---------- Product Operations ----------

export async function createProduct(
  workspaceId: string,
  ownerId: string,
  data: {
    name: string;
    description: string;
    imageUrl: string;
    verticalMetadata: Record<string, string | number | boolean>;
  }
): Promise<string> {
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...data,
    workspaceId,
    ownerId,
    glbUrl: null,
    usdzUrl: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getProductsByWorkspace(workspaceId: string) {
  const productsRef = collection(db, 'products');
  const q = query(
    productsRef,
    where('workspaceId', '==', workspaceId)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

export async function getProductById(productId: string) {
  const productRef = doc(db, 'products', productId);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) return null;

  return { ...productSnap.data(), id: productSnap.id };
}

export async function updateProduct(
  productId: string,
  data: Partial<{
    name: string;
    description: string;
    imageUrl: string;
    verticalMetadata: Record<string, string | number | boolean>;
  }>
) {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string) {
  const productRef = doc(db, 'products', productId);
  await deleteDoc(productRef);
}

// ---------- Storage Operations ----------

export async function uploadProductImage(
  file: File,
  workspaceId: string
): Promise<string> {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const storageRef = ref(storage, `products/${workspaceId}/${fileName}`);

  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
}