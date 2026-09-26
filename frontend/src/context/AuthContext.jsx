import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await authApi.getMe();
          if (response.data.success) {
            setUser(response.data.data);
            setAuthenticated(true);
          }
        } catch (error) {
          console.error("Authentication check failed", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    if (response.data.success) {
      const { access, refresh } = response.data.data.tokens;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setUser(response.data.data.user);
      setAuthenticated(true);
      return response.data.data.user;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    return await authApi.register(name, email, password, confirmPassword);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthenticated(false);
      setUser(null);
    }
  };
  
  const updateProfile = async (name) => {
    const response = await authApi.updateProfile(name);
    if (response.data.success) {
      setUser(response.data.data);
    }
    return response.data;
  }

  return (
    <AuthContext.Provider value={{ user, loading, authenticated, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
