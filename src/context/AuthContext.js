// Auth Context - Global authentication state
// src/context/AuthContext.js
// With delayed Firebase initialization to prevent RCTEventEmitter crash

import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';

const AuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  refreshProfile: () => {},
  isLoggedIn: false,
  isInitialized: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const unsubscribeRef = useRef(null);
  const mountedRef = useRef(true);
  const authServiceRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    
    // Firebase initialization with significant delay
    const initTimer = setTimeout(async () => {
      if (!mountedRef.current) return;
      
      try {
        console.log('🔥 Initializing Firebase Auth...');
        
        // Dynamic import to delay Firebase loading
        const authService = await import('../services/authService');
        authServiceRef.current = authService;
        
        if (!mountedRef.current) return;
        
        // Additional delay after import
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!mountedRef.current) return;
        
        console.log('🔥 Setting up auth state listener...');
        
        unsubscribeRef.current = authService.onAuthStateChanged(async (firebaseUser) => {
          if (!mountedRef.current) return;
          
          console.log('🔥 Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
          
          if (firebaseUser) {
            setUser(firebaseUser);
            try {
              const result = await authService.getUserProfile(firebaseUser.uid);
              if (mountedRef.current && result && result.success) {
                setUserProfile(result.data);
              }
            } catch (profileError) {
              console.log('Error fetching profile:', profileError);
            }
          } else {
            setUser(null);
            setUserProfile(null);
          }
          
          if (mountedRef.current) {
            setLoading(false);
            setIsInitialized(true);
          }
        });
        
        console.log('🔥 Auth listener set up successfully');
        
      } catch (error) {
        console.log('Auth initialization error:', error);
        if (mountedRef.current) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    }, 2000); // 2 second delay before Firebase Auth

    return () => {
      mountedRef.current = false;
      clearTimeout(initTimer);
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user || !mountedRef.current) return;
    
    try {
      const authService = authServiceRef.current || await import('../services/authService');
      const result = await authService.getUserProfile(user.uid);
      if (mountedRef.current && result && result.success) {
        setUserProfile(result.data);
      }
    } catch (error) {
      console.log('Refresh profile error:', error);
    }
  }, [user]);

  const value = {
    user,
    userProfile,
    loading,
    refreshProfile,
    isLoggedIn: !!user,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;