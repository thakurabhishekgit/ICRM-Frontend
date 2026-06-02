import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

const STORAGE_TOKEN = 'token';
const STORAGE_USER = 'user';

const parseStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = (token, user) => {
  localStorage.setItem(STORAGE_TOKEN, token);
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
};

const normalizeUser = (data) => ({
  id: data.id,
  fullName: data.fullName,
  email: data.email,
  phoneNumber: data.phoneNumber,
  role: data.role,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN);
    const storedUser = parseStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);

    if (!result?.success || !result?.data?.token) {
      throw new Error(result?.message || 'Login failed. Please try again.');
    }

    const { token, ...userFields } = result.data;
    const sessionUser = normalizeUser(userFields);

    persistSession(token, sessionUser);
    setUser(sessionUser);

    return sessionUser;
  }, []);

  const register = useCallback(async (payload) => {
    const result = await authService.register(payload);

    if (result?.success === false) {
      throw new Error(result?.message || 'Registration failed. Please try again.');
    }

    return result;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
