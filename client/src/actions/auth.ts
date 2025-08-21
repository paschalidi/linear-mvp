'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/task';
import { apiRequest } from "@/lib/apiRequest";

export async function login({ email, password }: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.data) {
      throw new Error('Login failed');
    }

    // Set auth cookie for server-side access
    const cookieStore = await cookies();
    cookieStore.set('auth_token', response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response.data;
  } catch (error) {
    console.error('Failed to login:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to login');
  }
}

export async function register({ email, password, name }: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.data) {
      throw new Error('Registration failed');
    }

    // Set auth cookie for server-side access
    const cookieStore = await cookies();
    cookieStore.set('auth_token', response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response.data;
  } catch (error) {
    console.error('Failed to register:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to register');
  }
}

export async function logout(): Promise<void> {
  try {
    // Call server logout endpoint to clear cookie
    await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // Even if server call fails, we'll clear client-side data
    console.error('Server logout failed:', error);
  }
}
