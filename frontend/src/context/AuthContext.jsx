import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

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
          const response = await api.get('/auth/me/');
          setUser(response.data);
          setAuthenticated(true);
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
    const response = await api.post('/auth/login/', { email, password });
    const { access, refresh } = response.data.tokens;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    const userResponse = await api.get('/auth/me/');
    setUser(userResponse.data);
    setAuthenticated(true);
    return userResponse.data;
  };

  const register = async (name, email, password) => {
    return await api.post('/auth/register/', { name, email, password });
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
