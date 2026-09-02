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
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence).catch(console.error);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const mysqlUser = await fetchMySQLUser(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName || 'User', null);
          
          if (mysqlUser) {
            setUser({ ...mysqlUser, firebase_uid: firebaseUser.uid });
          } else {
            setUser({ 
              id: firebaseUser.uid, 
              firebase_uid: firebaseUser.uid, 
              email: firebaseUser.email, 
              role: 'donor', 
              name: firebaseUser.displayName || 'User' 
            });
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

  const register = async (email, password, name, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }
    const mysqlUser = await fetchMySQLUser(userCredential.user.uid, email, name, role);
    setUser({ ...userCredential.user, firebase_uid: userCredential.user.uid, role: mysqlUser?.role || role });
    return userCredential.user;
  };

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async (roleIfNew = 'donor') => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const mysqlUser = await fetchMySQLUser(
      userCredential.user.uid, 
      userCredential.user.email, 
      userCredential.user.displayName, 
      roleIfNew
    );
    setUser({ ...userCredential.user, firebase_uid: userCredential.user.uid, role: mysqlUser?.role || roleIfNew });
    return userCredential.user;
  };

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