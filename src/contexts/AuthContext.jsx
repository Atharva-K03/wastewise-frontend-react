import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);

  // Dummy user data for different roles
  const validCredentials = {
    'W001': { password: 'admin123', name: 'Admin User', empId: 'W001', role: 'Admin' },
    'W002': { password: 'scheduler123', name: 'Scheduler User', empId: 'W002', role: 'Scheduler' },
    'W003': { password: 'worker123', name: 'Worker User', empId: 'W003', role: 'Worker' },
  };

  useEffect(() => {
    // Simulate checking for a logged-in user (e.g., from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (empId, password) => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const credential = validCredentials[empId];
        if (credential && credential.password === password) {
          const loggedInUser = { empId: credential.empId, name: credential.name, role: credential.role };
          setUser(loggedInUser);
          localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          resolve(loggedInUser);
        } else {
          reject(new Error('Invalid Employee ID or Password'));
        }
        setIsLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

