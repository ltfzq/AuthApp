import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Failed to restore session:', error);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const signup = async (name, email, password) => {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    const exists = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const newUsers = [...users, { name, email, password }];
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));

    const userInfo = { name, email };
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const login = async (email, password) => {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!match) {
      throw new Error('Incorrect email or password.');
    }

    const userInfo = { name: match.name, email: match.email };
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
