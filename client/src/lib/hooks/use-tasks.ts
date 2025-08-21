'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, getTasks, updateTask } from '@/actions/tasks';
import { Status, Task, UpdateTaskRequest } from '@/types/task';
import { toast } from 'sonner';
import { useAuth } from './use-auth';
import { useMemo } from 'react';

// Query keys
export const taskKeys = {
  all: (userId: string) => ['tasks', userId] as const,
  detail: (userId: string, id: string) => ['tasks', userId, 'detail', id] as const,
  status: (userId: string, status: Status) => ['tasks', userId, 'status', status] as const,
};

// Enhanced error handler with sanitized messages
const handleError = (error: unknown, fallbackMessage: string) => {
  const message = error instanceof Error && error.message
    ? error.message.includes('Network') || error.message.includes('Failed to fetch')
      ? 'Connection error. Please try again.'
      : 'An error occurred. Please try again.'
    : fallbackMessage;

  toast.error(message);
};

// Custom hook for user validation
const useValidatedUser = () => {
  const { data: user } = useAuth();

  return useMemo(() => ({
    user,
    isValid: !!user?.id,
  }), [user]);
};

// Enhanced useTasks with better caching
export function useTasks() {
  const { user, isValid } = useValidatedUser();

  return useQuery({
    queryKey: taskKeys.all(user?.id || ''),
    queryFn: getTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isValid,
  });
}

// Optimistic create hook
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      if (!user?.id) return;

      // Update the tasks list cache
      queryClient.setQueryData<Task[]>(taskKeys.all(user.id), (old) => {
        return old ? [newTask, ...old] : [newTask];
      });

      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
}

// optimistic updates
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { user, isValid } = useValidatedUser();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskRequest }) =>
      updateTask({ id, updates }),
    onMutate: async ({ id, updates }) => {
      if (!isValid) return;

      await queryClient.cancelQueries({ queryKey: taskKeys.all(user!.id) });
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(user!.id, id) });

      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.all(user!.id));
      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(user!.id, id));

      // Optimistic update
      queryClient.setQueryData<Task[]>(taskKeys.all(user!.id), (old) =>
        old?.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        ) || []
      );

      // Also update individual task cache if it exists (for task detail drawer)
      // This ensures the drawer shows updated data immediately without waiting for server response
      if (previousTask) {
        queryClient.setQueryData(
          taskKeys.detail(user!.id, id),
          { ...previousTask, ...updates, updatedAt: new Date().toISOString() }
        );
      }

      return { previousTasks, previousTask, taskId: id };
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(taskKeys.all(user!.id), (old) =>
        old?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ) || []
      );

      queryClient.setQueryData(taskKeys.detail(user!.id, updatedTask.id), updatedTask);
      toast.success('Task updated successfully');
    },
    onError: (error, { id }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.all(user!.id), context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.detail(user!.id, id), context.previousTask);
      }

      handleError(error, 'Failed to update task');
    },
  });
}

// delete with optimistic updates
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteTask({ id }),
    onSuccess: (_, { id: deletedId }) => {
      if (!user?.id) return;

      // Remove from tasks list cache
      queryClient.setQueryData<Task[]>(taskKeys.all(user.id), (old) => {
        return old?.filter((task) => task.id !== deletedId) || [];
      });

      // Remove from individual task cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(user.id, deletedId) });

      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete task');
    },
  });
}

// Optimistic update for status changes
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  const { user, isValid } = useValidatedUser();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      updateTask({ id, updates: { status } }),
    onMutate: async ({ id, status }) => {
      if (!isValid) return;

      // Cancel any outgoing refetches and mutations for this task
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(user!.id, id) });

      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.all(user!.id));

      queryClient.setQueryData<Task[]>(taskKeys.all(user!.id), (old) =>
        old?.map((task) =>
          task.id === id
            ? { ...task, status, updatedAt: new Date().toISOString() }
            : task
        ) || []
      );

      queryClient.setQueryData(taskKeys.detail(user!.id, id), (old: Task | undefined) =>
        old ? { ...old, status, updatedAt: new Date().toISOString() } : old
      );

      return { previousTasks, taskId: id };
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(taskKeys.all(user!.id), (old) =>
        old?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ) || []
      );

      queryClient.setQueryData(taskKeys.detail(user!.id, updatedTask.id), updatedTask);
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.all(user!.id), context.previousTasks);
      }

      if (context?.taskId) {
        const originalTask = context.previousTasks?.find(t => t.id === context.taskId);
        if (originalTask) {
          queryClient.setQueryData(taskKeys.detail(user!.id, context.taskId), originalTask);
        }
      }

      handleError(error, 'Failed to update task status');
    },
  });
}