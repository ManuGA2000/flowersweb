// src/context/AuthContext.js - Add environment detection

import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

const isSimulator = Platform.OS === 'ios' && !Platform.isPad; // Basic check

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
        
        // CRITICAL: Try/Catch to handle Appetize.io keychain issues
        try {
          const authService = await import('../services/authService');
          authServiceRef.current = authService;
          
          if (!mountedRef.current) return;
          
          // Additional delay after import
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (!mountedRef.current) return;
          
          console.log('🔥 Setting up auth state listener...');
          
          // GUARD: Wrap keychain access in error handler
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
        } catch (keychainError) {
          // Appetize.io or simulator keychain error
          console.warn('⚠️ Keychain access failed (normal on simulators/Appetize):', keychainError);
          if (mountedRef.current) {
            setLoading(false);
            setIsInitialized(true);
            // Continue without keychain (guest mode)
          }
        }
      } catch (error) {
        console.error('Firebase init error:', error);
        if (mountedRef.current) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    }, 1000); // Initial delay before Firebase init

    return () => {
      mountedRef.current = false;
      clearTimeout(initTimer);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isLoggedIn, isInitialized }}>
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