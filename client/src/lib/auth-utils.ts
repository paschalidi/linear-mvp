'use server';

import { cookies } from 'next/headers';

/**
 * Get authorization headers with Bearer token if available
 * Returns an object that can be spread into fetch headers
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return {};
  }
}
