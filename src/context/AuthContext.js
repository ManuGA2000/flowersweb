// Auth Context - Global authentication state
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // Delay Firebase initialization significantly
    const timer = setTimeout(async () => {
      try {
        // Dynamic import to delay Firebase loading
        const { onAuthStateChanged, getUserProfile } = await import('../services/authService');
        
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
        
        setIsInitialized(true);
      } catch (error) {
        console.log('Auth initialization error:', error);
        setLoading(false);
        setIsInitialized(true);
      }
    }, 2000); // 2 second delay

    return () => {
      clearTimeout(timer);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      try {
        const { getUserProfile } = await import('../services/authService');
        const result = await getUserProfile(user.uid);
        if (result.success) {
          setUserProfile(result.data);
        }
      } catch (error) {
        console.log('Refresh profile error:', error);
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
      isInitialized,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;