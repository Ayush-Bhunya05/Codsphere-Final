import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('codesphere_token');
      const storedUser = localStorage.getItem('codesphere_user');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Verify token is still valid by making a simple API call
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('codesphere_token');
          localStorage.removeItem('codesphere_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('codesphere_user', JSON.stringify(userData));
    localStorage.setItem('codesphere_token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codesphere_user');
    localStorage.removeItem('codesphere_token');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};