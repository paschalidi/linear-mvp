import { ApiResponse } from "@/types/task";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


class ServerActionError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ServerActionError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      cache: 'no-store',
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ServerActionError(response.status, data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof ServerActionError) {
      throw error;
    }
    throw new ServerActionError(500, 'Network error occurred');
  }
}