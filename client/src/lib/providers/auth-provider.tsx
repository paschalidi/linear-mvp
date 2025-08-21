'use client';

import { createContext, useContext } from 'react';
import { useAuth, useLogin, useLogout, useRegister } from '@/lib/hooks/use-auth';
import { AuthState, LoginRequest, RegisterRequest } from '@/types/auth';

interface AuthContextType {
  auth: AuthState | undefined;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: user, isLoading } = useAuth();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (data: LoginRequest) => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterRequest) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const isAuthenticated = user !== null;

  // Create AuthState object from user data
  const auth: AuthState | undefined = user ? {
    user,
    token: null, // Token is in HTTP-only cookie
    isAuthenticated: true
  } : {
    user: null,
    token: null,
    isAuthenticated: false
  };

  const value: AuthContextType = {
    auth,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
