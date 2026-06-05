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
  deleteDoc, 
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { type BusinessType, type UserProfile, type Workspace } from '@/types';
import { generateId } from '@/lib/utils/date';

// Add to your imports at the top:
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { storage } from '@/lib/firebase/config';

export async function uploadGLBToStorage(
  glbBuffer: ArrayBuffer,
  workspaceId: string,
  productId: string
): Promise<string> {
  const storageRef = ref(storage, `ar-models/${workspaceId}/${productId}.glb`);
  
  // Upload the binary ArrayBuffer
  await uploadBytes(storageRef, glbBuffer, {
    contentType: 'model/gltf-binary',
    customMetadata: {
      workspaceId,
      productId,
    },
  });

  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

export async function updateProductGLBUrl(productId: string, glbUrl: string) {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, {
    glbUrl,
    updatedAt: serverTimestamp(),
  });
}


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

// ---------- QR Code Operations ----------

export async function createQRCode(
  workspaceId: string,
  ownerId: string,
  data: {
    productId: string;
    linkedArUrl: string;
    qrImageUrl: string;
    style: { color: string; backgroundColor: string; logoUrl: string | null };
  }
): Promise<string> {
  const qrcodesRef = collection(db, 'qrcodes');
  const docRef = await addDoc(qrcodesRef, {
    ...data,
    workspaceId,
    ownerId,
    scanCount: 0,
    createdAt: serverTimestamp(),
  });

  await updateDoc(docRef, { qrcodeId: docRef.id });
  return docRef.id;
}

export async function getQRCodesByWorkspace(workspaceId: string) {
  const qrcodesRef = collection(db, 'qrcodes');
  const q = query(qrcodesRef, where('workspaceId', '==', workspaceId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

export async function deleteQRCode(qrcodeId: string) {
  const qrcodeRef = doc(db, 'qrcodes', qrcodeId);
  await deleteDoc(qrcodeRef);
}

// ---------- Analytics Operations ----------

export async function trackAnalyticsEvent(data: {
  eventType: 'qr_scan' | 'ar_launch' | 'ar_view_duration';
  productId: string;
  workspaceId: string;
  deviceType: string;
  sessionId: string;
}) {
  const analyticsRef = collection(db, 'analytics');
  await addDoc(analyticsRef, {
    ...data,
    timestamp: serverTimestamp(),
  });

  // Also increment the QR code scan count if it's a qr_scan
  if (data.eventType === 'qr_scan') {
    const qrcodesRef = collection(db, 'qrcodes');
    const q = query(qrcodesRef, where('productId', '==', data.productId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const qrDoc = snapshot.docs[0];
      const currentCount = qrDoc.data().scanCount || 0;
      await updateDoc(doc(db, 'qrcodes', qrDoc.id), {
        scanCount: currentCount + 1,
      });
    }
  }
}

export function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ---------- Analytics Aggregation ----------

export async function getAnalyticsByWorkspace(
  workspaceId: string,
  days: number = 30
): Promise<any[]> {
  const analyticsRef = collection(db, 'analytics');
  
  // Calculate start date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const q = query(
    analyticsRef,
    where('workspaceId', '==', workspaceId),
    orderBy('timestamp', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  const events = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.timestamp?.seconds ? new Date(data.timestamp.seconds * 1000) : new Date(),
    };
  });

  // Filter client-side by date range (avoids needing composite indexes for every query)
  return events.filter((event) => event.date >= startDate);
}

export function aggregateAnalytics(events: any[]) {
  const totalScans = events.filter((e) => e.eventType === 'qr_scan').length;
  const totalARLaunches = events.filter((e) => e.eventType === 'ar_launch').length;
  
  // Group scans by day for the chart
  const scansByDay: Record<string, number> = {};
  const launchesByDay: Record<string, number> = {};
  
  events.forEach((event) => {
    const dayKey = event.date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (event.eventType === 'qr_scan') {
      scansByDay[dayKey] = (scansByDay[dayKey] || 0) + 1;
    } else if (event.eventType === 'ar_launch') {
      launchesByDay[dayKey] = (launchesByDay[dayKey] || 0) + 1;
    }
  });

  // Merge into single array for Recharts
  const allDays = new Set([...Object.keys(scansByDay), ...Object.keys(launchesByDay)]);
  const chartData = Array.from(allDays)
    .sort()
    .map((day) => ({
      date: day,
      scans: scansByDay[day] || 0,
      launches: launchesByDay[day] || 0,
    }));

  // Top products by scans
  const productScans: Record<string, number> = {};
  events.forEach((event) => {
    if (event.eventType === 'qr_scan' && event.productId) {
      productScans[event.productId] = (productScans[event.productId] || 0) + 1;
    }
  });

  const topProducts = Object.entries(productScans)
    .map(([productId, count]) => ({ productId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Device breakdown
  const devices: Record<string, number> = {};
  events.forEach((event) => {
    if (event.deviceType) {
      devices[event.deviceType] = (devices[event.deviceType] || 0) + 1;
    }
  });

  return {
    totalScans,
    totalARLaunches,
    conversionRate: totalScans > 0 ? ((totalARLaunches / totalScans) * 100).toFixed(1) : 0,
    chartData,
    topProducts,
    devices,
  };
}

// ---------- User Profile Updates ----------

export async function updateUserProfile(
  uid: string,
  data: {
    displayName?: string;
    photoURL?: string;
  }
) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
}

export async function updateWorkspaceName(
  workspaceId: string,
  workspaceName: string
) {
  const workspaceRef = doc(db, 'workspaces', workspaceId);
  await updateDoc(workspaceRef, { workspaceName });
}

export async function uploadProfilePicture(
  file: File,
  uid: string
): Promise<string> {
  const storageRef = ref(storage, `avatars/${uid}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ---------- Template Operations ----------

export async function getTemplatesFromFirestore(workspaceId: string) {
  const templatesRef = collection(db, 'templates');
  const q = query(templatesRef, where('isPublic', '==', true));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}