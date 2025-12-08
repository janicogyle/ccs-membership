'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          } else {
            console.log('No Firestore document found, using basic Firebase auth');
            // If no Firestore doc, use basic Firebase auth data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              isAdmin: false,
            });
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (userData, token) => {
    authService.storeToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.clearToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    token: authService.getToken(),
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
