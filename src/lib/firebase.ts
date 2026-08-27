import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  Firestore
} from 'firebase/firestore';
import { SavedLeadItem, SearchQueryRecord, UserProfile } from '../types';

// Read env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization error, using local fallback:', err);
  }
}

// Local Storage Fallback keys
const LOCAL_USER_KEY = 'ai_lead_finder_user';
const LOCAL_SAVED_LEADS_KEY = 'ai_lead_finder_saved_leads';
const LOCAL_SEARCH_HISTORY_KEY = 'ai_lead_finder_search_history';

// Mock user for local/demo mode
const DEMO_USER: UserProfile = {
  uid: 'demo-user-123',
  displayName: 'Alex Rivers',
  email: 'alex.rivers@freelance.io',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isDemo: true,
};

// Authentication Listeners
export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void) {
  if (auth && isFirebaseConfigured) {
    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Freelance User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          isDemo: false,
        });
      } else {
        callback(null);
      }
    });
  } else {
    // Check localStorage for local session
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    if (stored) {
      try {
        callback(JSON.parse(stored));
      } catch {
        callback(DEMO_USER);
      }
    } else {
      callback(DEMO_USER); // Default to logged in demo user for seamless start
    }
    return () => {};
  }
}

export async function loginWithGoogle(): Promise<UserProfile> {
  if (auth && isFirebaseConfigured) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      isDemo: false,
    };
    return userProfile;
  } else {
    // Local / Demo login simulation
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEMO_USER));
    return DEMO_USER;
  }
}

export async function logout(): Promise<void> {
  if (auth && isFirebaseConfigured) {
    await signOut(auth);
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
}

// Saved Leads API
export async function saveLead(userId: string, item: Omit<SavedLeadItem, 'id' | 'userId' | 'savedAt'>): Promise<SavedLeadItem> {
  const newLead: SavedLeadItem = {
    ...item,
    id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    userId,
    savedAt: new Date().toISOString(),
  };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'saved_leads', newLead.id);
      await setDoc(docRef, newLead);
      return newLead;
    } catch (e) {
      console.warn('Firestore write failed, falling back to local storage:', e);
    }
  }

  // Local storage fallback
  const stored = localStorage.getItem(LOCAL_SAVED_LEADS_KEY);
  const list: SavedLeadItem[] = stored ? JSON.parse(stored) : [];
  list.unshift(newLead);
  localStorage.setItem(LOCAL_SAVED_LEADS_KEY, JSON.stringify(list));
  return newLead;
}

export async function getSavedLeads(userId: string): Promise<SavedLeadItem[]> {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'saved_leads'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const leads: SavedLeadItem[] = [];
      querySnapshot.forEach((doc) => {
        leads.push(doc.data() as SavedLeadItem);
      });
      return leads.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    } catch (e) {
      console.warn('Firestore fetch failed, using local storage:', e);
    }
  }

  // Local storage fallback
  const stored = localStorage.getItem(LOCAL_SAVED_LEADS_KEY);
  const list: SavedLeadItem[] = stored ? JSON.parse(stored) : [];
  return list.filter((item) => item.userId === userId);
}

export async function deleteSavedLead(userId: string, leadId: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'saved_leads', leadId));
    } catch (e) {
      console.warn('Firestore delete failed, updating local storage:', e);
    }
  }

  // Local storage fallback
  const stored = localStorage.getItem(LOCAL_SAVED_LEADS_KEY);
  if (stored) {
    const list: SavedLeadItem[] = JSON.parse(stored);
    const updated = list.filter((item) => item.id !== leadId);
    localStorage.setItem(LOCAL_SAVED_LEADS_KEY, JSON.stringify(updated));
  }
}

// Search History API
export async function saveSearchHistory(
  userId: string,
  record: Omit<SearchQueryRecord, 'id' | 'userId' | 'timestamp'>
): Promise<SearchQueryRecord> {
  const newRecord: SearchQueryRecord = {
    ...record,
    id: 'search_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    userId,
    timestamp: new Date().toISOString(),
  };

  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'search_history', newRecord.id);
      await setDoc(docRef, newRecord);
      return newRecord;
    } catch (e) {
      console.warn('Firestore search history write failed:', e);
    }
  }

  // Local storage fallback
  const stored = localStorage.getItem(LOCAL_SEARCH_HISTORY_KEY);
  const list: SearchQueryRecord[] = stored ? JSON.parse(stored) : [];
  list.unshift(newRecord);
  localStorage.setItem(LOCAL_SEARCH_HISTORY_KEY, JSON.stringify(list));
  return newRecord;
}

export async function getSearchHistory(userId: string): Promise<SearchQueryRecord[]> {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'search_history'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const history: SearchQueryRecord[] = [];
      querySnapshot.forEach((doc) => {
        history.push(doc.data() as SearchQueryRecord);
      });
      return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
      console.warn('Firestore history fetch failed:', e);
    }
  }

  const stored = localStorage.getItem(LOCAL_SEARCH_HISTORY_KEY);
  const list: SearchQueryRecord[] = stored ? JSON.parse(stored) : [];
  return list.filter((item) => item.userId === userId);
}

export async function deleteSearchHistoryItem(userId: string, id: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'search_history', id));
    } catch (e) {
      console.warn('Firestore history delete failed:', e);
    }
  }

  const stored = localStorage.getItem(LOCAL_SEARCH_HISTORY_KEY);
  if (stored) {
    const list: SearchQueryRecord[] = JSON.parse(stored);
    const updated = list.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_SEARCH_HISTORY_KEY, JSON.stringify(updated));
  }
}
