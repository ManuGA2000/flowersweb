// Auth Context - Global authentication state
// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { onAuthStateChanged, getUserProfile } from '../services/authService';

const AuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  refreshProfile: () => {},
  isLoggedIn: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    // Delay Firebase Auth subscription
    const initTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      
      try {
        unsubscribeRef.current = onAuthStateChanged(async (firebaseUser) => {
          if (!mountedRef.current) return;
          
          if (firebaseUser) {
            setUser(firebaseUser);
            try {
              const result = await getUserProfile(firebaseUser.uid);
              if (mountedRef.current && result?.success) {
                setUserProfile(result.data);
              }
            } catch (e) {
              console.log('Profile fetch error:', e);
            }
          } else {
            setUser(null);
            setUserProfile(null);
          }
          
          if (mountedRef.current) {
            setLoading(false);
          }
        });
      } catch (error) {
        console.log('Auth error:', error);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }, 1500); // 1.5 second delay

    return () => {
      mountedRef.current = false;
      clearTimeout(initTimer);
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch (e) {}
      }
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user || !mountedRef.current) return;
    try {
      const result = await getUserProfile(user.uid);
      if (mountedRef.current && result?.success) {
        setUserProfile(result.data);
      }
    } catch (error) {
      console.log('Refresh error:', error);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading,
      refreshProfile,
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;