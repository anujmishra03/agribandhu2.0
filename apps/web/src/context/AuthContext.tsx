'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  state: string;
  district: string;
  village: string;
  preferredLanguage: string;
  farmSize: number;
  experience: number;
  primaryCrop: string;
  secondaryCrop?: string;
  bio?: string;
  // Phase 3 Extended fields
  dob?: string;
  gender?: string;
  country?: string;
  pinCode?: string;
  farmerCategory?: string;
  preferredUnits?: string;
  organicFarming?: boolean;
  irrigationMethod?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'FARMER' | 'ADMIN' | 'OFFICER';
  avatar?: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  registerUser: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ debugToken?: string; message: string }>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Load user session on mount
  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const text = await res.text();
          const data = text ? JSON.parse(text) : null;
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }
    setUser(data);
  };

  const registerUser = async (formData: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }
    setUser(data);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  const forgotPassword = async (email: string) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Password reset request failed.');
    }
    return data;
  };

  const resetPassword = async (token: string, password: string) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Password reset failed.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerUser,
        logout,
        forgotPassword,
        resetPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
