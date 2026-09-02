import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth';

const AuthContext = createContext(undefined);

/**
 * REAL MYSQL BACKEND FETCH:
 * This calls your Node.js + Express backend to upsert the user into your MySQL database.
 */
const fetchMySQLUser = async (uid, email, name, role) => {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, email, name, role })
    });
    
    if (!res.ok) {
      throw new Error('Failed to save/fetch user from MySQL');
    }
    
    return await res.json();
  } catch (err) {
    console.error('MySQL Connection Error:', err);
    // Fallback if local backend is down
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    // Force session persistence so closing tab logs them out (requested by user for showcase)
    setPersistence(auth, browserSessionPersistence).catch(console.error);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const mysqlUser = await fetchMySQLUser(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName || 'User', null);
          
          if (mysqlUser) {
            setUser(mysqlUser);
          } else {
            // Fallback just in case
            setUser({ id: firebaseUser.uid, email: firebaseUser.email, role: 'donor', name: firebaseUser.displayName || 'User' });
          }
        } catch (error) {
          console.error("Error fetching user data from backend", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real Email/Password Registration
  const register = async (email, password, name, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    // Send to your MySQL backend:
    const mysqlUser = await fetchMySQLUser(userCredential.user.uid, email, name, role);
    setUser({ ...userCredential.user, role: mysqlUser?.role || role });
    return userCredential.user;
  };

  // Real Email/Password Login
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Real Google Sign-In
  const loginWithGoogle = async (roleIfNew = 'donor') => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    // When logging in with Google, they might be a new user. 
    // We send the data to our "MySQL DB". If they already exist, it will just return their existing role.
    const mysqlUser = await fetchMySQLUser(
      userCredential.user.uid, 
      userCredential.user.email, 
      userCredential.user.displayName, 
      roleIfNew
    );
    setUser({ ...userCredential.user, role: mysqlUser?.role || roleIfNew });
    return userCredential.user;
  };

  // Real Logout
  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, loginWithGoogle, logout, resetPassword, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
