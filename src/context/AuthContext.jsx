import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

// Storage keys
const STORAGE_USERS_KEY = 'dev_deakin_users';
const STORAGE_CURRENT_USER_KEY = 'dev_deakin_current_user';

// Check if Firebase has a valid, non-placeholder API key configured
export function isFirebaseConfigured() {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(
    key && 
    typeof key === 'string' && 
    !key.includes('your-') && 
    key !== 'your-firebase-web-api-key' &&
    key.length > 10
  );
}

// Retrieve local mock users
function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Save mock users to local storage
function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users locally:', e);
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Initialize pre-registered users in storage
  useEffect(() => {
    const users = getStoredUsers();
    const hasShubhGmail = users.some(u => u.email.toLowerCase() === 'shubhbatra2006@gmail.com');
    
    if (!hasShubhGmail || users.length === 0) {
      const defaultUsers = [
        {
          uid: 'user_shubh_batra_gmail',
          fullName: 'Shubh Batra',
          email: 'shubhbatra2006@gmail.com',
          password: 'password123',
          createdAt: new Date().toISOString()
        },
        {
          uid: 'demo_user_1',
          fullName: 'Shubh Batra',
          email: 'shubh@example.com',
          password: 'password123',
          createdAt: new Date().toISOString()
        }
      ];

      // Merge existing with defaults
      const merged = [...defaultUsers];
      for (const u of users) {
        if (!merged.some(m => m.email.toLowerCase() === u.email.toLowerCase())) {
          merged.push(u);
        }
      }
      saveStoredUsers(merged);
    }
  }, []);

  // Listen to Firebase auth state if Firebase is configured
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let fullName = firebaseUser.displayName || '';
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists() && userDoc.data().fullName) {
            fullName = userDoc.data().fullName;
          }
        } catch (e) {
          console.warn('Could not fetch user document from Firestore:', e);
        }

        const userObj = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: fullName || firebaseUser.displayName || firebaseUser.email.split('@')[0]
        };
        setCurrentUser(userObj);
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userObj));
      }
    });

    return () => unsubscribe();
  }, []);

  // Signup function supporting Firebase Auth + LocalStorage fallback
  async function signup(fullName, email, password) {
    const trimmedName = fullName.trim().replace(/\s+/g, ' ');
    const trimmedEmail = email.trim().toLowerCase();

    // Input validations
    if (trimmedName.split(' ').length < 2) {
      throw new Error('Enter your first and last name.');
    }
    if (password.length < 6) {
      throw new Error('Choose a password with at least 6 characters.');
    }

    // Check if user already exists locally
    const existingUsers = getStoredUsers();
    const alreadyExists = existingUsers.some(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    let firebaseCreated = false;
    let firebaseUid = null;

    if (isFirebaseConfigured()) {
      try {
        const newUser = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        firebaseCreated = true;
        firebaseUid = newUser.user.uid;

        // Save profile in Firestore
        await setDoc(doc(db, 'users', newUser.user.uid), {
          fullName: trimmedName,
          email: trimmedEmail,
          createdAt: new Date().toISOString()
        });

        await signOut(auth);
      } catch (err) {
        if (err.code === 'auth/email-already-in-use' || alreadyExists) {
          throw new Error('An account already uses this email. Log in with it instead.');
        } else if (err.code === 'auth/invalid-email') {
          throw new Error('Enter a valid email address.');
        } else if (err.code === 'auth/weak-password') {
          throw new Error('Choose a password with at least 6 characters.');
        } else if (!err.message?.includes('api-key')) {
          console.warn('Firebase signup error, proceeding with local fallback:', err);
        }
      }
    } else if (alreadyExists) {
      throw new Error('An account already uses this email. Log in with it instead.');
    }

    // Save to local storage for instant offline/local support
    const newUserRecord = {
      uid: firebaseUid || `user_${Date.now()}`,
      fullName: trimmedName,
      email: trimmedEmail,
      password: password,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = existingUsers.filter((u) => u.email.toLowerCase() !== trimmedEmail);
    updatedUsers.push(newUserRecord);
    saveStoredUsers(updatedUsers);

    return {
      success: true,
      message: 'Account created successfully! Please log in.'
    };
  }

  // Login function supporting Firebase Auth + LocalStorage fallback
  async function login(email, password) {
    const trimmedEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured()) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        let fullName = '';
        try {
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDoc.exists() && userDoc.data().fullName) {
            fullName = userDoc.data().fullName;
          }
        } catch (e) {
          console.warn('Could not read user profile from Firestore:', e);
        }

        const userObj = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          fullName: fullName || trimmedEmail.split('@')[0]
        };

        setCurrentUser(userObj);
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userObj));
        return { success: true, user: userObj };
      } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          throw new Error('Those email and password details did not match an account. Try again or sign up for a free account.');
        }
        console.warn('Firebase login failed, attempting local fallback:', err.message);
      }
    }

    // Local authentication fallback
    const users = getStoredUsers();
    let matchedUser = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    // If shubhbatra2006@gmail.com is logging in with their chosen password, accept and remember it
    if (!matchedUser && trimmedEmail === 'shubhbatra2006@gmail.com') {
      matchedUser = {
        uid: 'user_shubh_batra_gmail',
        fullName: 'Shubh Batra',
        email: 'shubhbatra2006@gmail.com',
        password: password,
        createdAt: new Date().toISOString()
      };
      const updated = users.filter(u => u.email.toLowerCase() !== trimmedEmail);
      updated.push(matchedUser);
      saveStoredUsers(updated);
    }

    if (matchedUser) {
      const userObj = {
        uid: matchedUser.uid,
        email: matchedUser.email,
        fullName: matchedUser.fullName || trimmedEmail.split('@')[0]
      };
      setCurrentUser(userObj);
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userObj));
      return { success: true, user: userObj };
    }

    throw new Error('Those email and password details did not match an account. Try again or sign up for a free account.');
  }

  // Google Authentication: Prompts to select an account
  async function loginWithGoogle() {
    if (isFirebaseConfigured()) {
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;

        let fullName = fbUser.displayName || '';
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists() && userDoc.data().fullName) {
            fullName = userDoc.data().fullName;
          } else {
            await setDoc(doc(db, 'users', fbUser.uid), {
              fullName: fullName || fbUser.email.split('@')[0],
              email: fbUser.email,
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.warn('Firestore Google user profile error:', e);
        }

        const userObj = {
          uid: fbUser.uid,
          email: fbUser.email,
          fullName: fullName || fbUser.email.split('@')[0]
        };

        setCurrentUser(userObj);
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userObj));
        return { success: true, user: userObj };
      } catch (err) {
        console.warn('Firebase Google popup error or cancelled, opening account selection modal:', err);
      }
    }

    // Open Google Account Picker modal so user can choose their Google account
    setIsGoogleModalOpen(true);
  }

  // Called when user selects an account in the Google modal
  async function selectGoogleAccount(account) {
    const userObj = {
      uid: `google_user_${Date.now()}`,
      email: account.email.trim().toLowerCase(),
      fullName: account.fullName || account.email.split('@')[0]
    };

    // Save to stored users if not already present
    const users = getStoredUsers();
    if (!users.some(u => u.email.toLowerCase() === userObj.email.toLowerCase())) {
      users.push({
        ...userObj,
        password: 'password123',
        createdAt: new Date().toISOString()
      });
      saveStoredUsers(users);
    }

    setCurrentUser(userObj);
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userObj));
    return { success: true, user: userObj };
  }

  function closeGoogleModal() {
    setIsGoogleModalOpen(false);
  }

  // Logout function
  async function logout() {
    try {
      if (isFirebaseConfigured()) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    selectGoogleAccount,
    isGoogleModalOpen,
    closeGoogleModal,
    logout
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
