'use server'
import { cookies } from 'next/headers';
import { User } from '@/types/auth';
import { apiRequest } from '@/lib/apiRequest';

/**
 * Get the current user on the server side (similar to NextAuth's getServerSession)
 * This can be used in server components, server actions, and API routes
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }

    // Make request to get current user with token
    const response = await apiRequest<User>('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data || null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated on server side
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Require authentication on server side - throws if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}
