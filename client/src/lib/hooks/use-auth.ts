'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, logout as logoutAction, register } from '@/actions/auth';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";

// Query keys
export const authKeys = {
  auth: ['auth'] as const,
  user: ['auth', 'user'] as const,
};


// Hooks
export function useAuth() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: getCurrentUser,
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
      // Clear any existing cache first to prevent data leakage
      queryClient.clear();

      // Update auth state in cache - just store the user data directly
      queryClient.setQueryData(authKeys.user, data.user);

      // Invalidate user-specific tasks to refetch user's tasks
      queryClient.invalidateQueries({ queryKey: ['tasks', data.user.id] });

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
      // Clear any existing cache first to prevent data leakage
      queryClient.clear();

      // Update auth state in cache - just store the user data directly
      queryClient.setQueryData(authKeys.user, data.user);

      // Invalidate user-specific tasks to refetch user's tasks
      queryClient.invalidateQueries({ queryKey: ['tasks', data.user.id] });

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
  const router = useRouter();

  return useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      // CRITICAL: Clear ALL cached data to prevent data leakage between users
      queryClient.clear();

      // Also remove any persisted data if using persistence
      queryClient.removeQueries();

      // Redirect to login page
      router.push('/login');

      toast.success('Logged out successfully');
    },
    onError: (error) => {
      // Even on error, clear cache for security
      queryClient.clear();
      router.push('/login');
      toast.error(error.message || 'Failed to logout');
    },
  });
}
