'use server';

import { revalidateTag } from 'next/cache';
import { CreateTaskRequest, Task, UpdateTaskRequest } from '@/types/task';
import { apiRequest } from "@/lib/apiRequest";
import { getAuthHeaders } from "@/lib/auth-utils";




export async function getTasks(): Promise<Task[]> {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await apiRequest<Task[]>('/api/tasks', {
      headers: authHeaders
    });
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch tasks');
  }
}

export async function getTask({ id }: { id: string }): Promise<Task> {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await apiRequest<Task>(`/api/tasks/${id}`, {
      headers: authHeaders
    });
    if (!response.data) {
      throw new Error('Task not found');
    }
    return response.data;
  } catch (error) {
    console.error('Failed to fetch task:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch task');
  }
}

export async function createTask(task: CreateTaskRequest): Promise<Task> {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await apiRequest<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: authHeaders
    });

    if (!response.data) {
      throw new Error('Failed to create task');
    }

    // Revalidate the tasks cache
    revalidateTag('tasks');

    return response.data;
  } catch (error) {
    console.error('Failed to create task:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create task');
  }
}

export async function updateTask({ id, updates }: { id: string; updates: UpdateTaskRequest }): Promise<Task> {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await apiRequest<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      headers: authHeaders
    });

    if (!response.data) {
      throw new Error('Failed to update task');
    }

    // Revalidate the tasks cache
    revalidateTag('tasks');

    return response.data;
  } catch (error) {
    console.error('Failed to update task:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update task');
  }
}

export async function deleteTask({ id }: { id: string }): Promise<void> {
  try {
    const authHeaders = await getAuthHeaders();

    await apiRequest(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: authHeaders
    });

    // Revalidate the tasks cache
    revalidateTag('tasks');
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete task');
  }
}
