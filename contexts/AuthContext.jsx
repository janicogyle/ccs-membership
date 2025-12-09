'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

// Helper to get initial state from localStorage (runs immediately)
const getInitialAuthState = () => {
  if (typeof window === 'undefined') return { user: null, isAuthenticated: false };
  
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      return { user: JSON.parse(storedUser), isAuthenticated: true };
    }
  } catch (e) {
    console.error('Error reading auth from localStorage:', e);
  }
  return { user: null, isAuthenticated: false };
};

export function AuthProvider({ children }) {
  // Initialize with localStorage values immediately to prevent flash redirects
  const [user, setUser] = useState(() => getInitialAuthState().user);
  const [isAuthenticated, setIsAuthenticated] = useState(() => getInitialAuthState().isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // Initialize auth state on mount and listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('Firebase user detected:', firebaseUser.uid);
          // Fetch full user data from Firestore with retry
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let userDoc = await getDoc(userDocRef);
          
          console.log('First attempt - Document exists:', userDoc.exists());
          
          // Retry once if document doesn't exist (in case of timing issue)
          if (!userDoc.exists()) {
            console.log('Retrying document fetch after 1 second...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            userDoc = await getDoc(userDocRef);
            console.log('Second attempt - Document exists:', userDoc.exists());
          }
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data from Firestore:', userData);
            const userObject = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name || firebaseUser.displayName,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phoneNumber: userData.phoneNumber,
              block: userData.block,
              program: userData.program,
              year: userData.year,
              isAdmin: userData.isAdmin || false,
            };
            console.log('Setting user object:', userObject);
            setUser(userObject);
            setIsAuthenticated(true);
            authService.storeUser(userObject);
          } else {
            console.log('No Firestore document found, using basic Firebase auth');
            // If no Firestore doc, use basic Firebase auth data
            const basicUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              isAdmin: false,
            };
            setUser(basicUser);
            setIsAuthenticated(true);
            authService.storeUser(basicUser);
          }
        } else {
          // Preserve auth if we still have a cached session while Firebase is catching up
          const storedUser = authService.getStoredUser();
          const storedToken = authService.getToken();

          if (storedUser && storedToken) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            authService.clearToken();
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        // Don't clear auth on error - keep localStorage state
      } finally {
        setIsLoading(false);
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (userData, token) => {
    authService.storeToken(token);
    setUser(userData);
    setIsAuthenticated(true);
    authService.storeUser(userData);
    setAuthReady(true);
  };

  const logout = () => {
    authService.logout().catch((error) => {
      console.error('Error during logout:', error);
    });
    setUser(null);
    setIsAuthenticated(false);
    setAuthReady(true);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    authService.storeUser(updatedUser);
  };

  const value = {
    user: authReady ? user : null,
    isAuthenticated: authReady ? isAuthenticated : Boolean(authService.getToken()),
    isLoading,
    login,
    logout,
    updateUser,
    token: authService.getToken(),
    authReady,
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
