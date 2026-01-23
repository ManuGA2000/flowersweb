// Auth Context - Global authentication state
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { onAuthStateChanged, getUserProfile } from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // Delay Firebase subscription to ensure RN is ready
    const timer = setTimeout(() => {
      try {
        unsubscribeRef.current = onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
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
      } catch (error) {
        console.log('Auth error:', error);
        setLoading(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
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