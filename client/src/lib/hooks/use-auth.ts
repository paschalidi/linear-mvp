'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, logout as logoutAction, register } from '@/actions/auth';
import { AuthState, User } from '@/types/auth';
import { apiRequest } from '@/lib/apiRequest';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

// Query keys
export const authKeys = {
  auth: ['auth'] as const,
  user: ['auth', 'user'] as const,
};

// Fetch current user from server
async function fetchCurrentUser(): Promise<AuthState> {
  try {
    const response = await apiRequest<User>('/api/auth/me');

    if (response.success && response.data) {
      return {
        user: response.data,
        token: null, // Token is in HTTP-only cookie
        isAuthenticated: true
      };
    }
  } catch (error) {
    // User not authenticated or error occurred
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false
  };
}

// Hooks
export function useAuth() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth failures
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Update auth state in cache
      queryClient.setQueryData(authKeys.user, {
        user: data.user,
        token: null, // Token is in HTTP-only cookie
        isAuthenticated: true
      });

      // Invalidate tasks to refetch user's tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      toast.success('Login successful!');
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Update auth state in cache
      queryClient.setQueryData(authKeys.user, {
        user: data.user,
        token: null, // Token is in HTTP-only cookie
        isAuthenticated: true
      });

      // Invalidate tasks to refetch user's tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      toast.success('Registration successful!');
      router.push('/')
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      // Update auth state
      queryClient.setQueryData(authKeys.user, {
        user: null,
        token: null,
        isAuthenticated: false
      });

      // Clear all cached data
      queryClient.clear();

      toast.success('Logged out successfully');
    },
  });
}
