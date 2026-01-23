// Auth Context - Global authentication state
// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { onAuthStateChanged, getUserProfile } from '../services/authService';
import { InteractionManager } from 'react-native';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // Wait for React Native to be fully ready before subscribing to Firebase
    const task = InteractionManager.runAfterInteractions(() => {
      unsubscribeRef.current = onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          // Fetch user profile from Firestore
          const result = await getUserProfile(firebaseUser.uid);
          if (result.success) {
            setUserProfile(result.data);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
    });

    return () => {
      task.cancel();
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const result = await getUserProfile(user.uid);
      if (result.success) {
        setUserProfile(result.data);
      }
    }
  };

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

export const useAuth = () => useContext(AuthContext);

export default AuthContext;