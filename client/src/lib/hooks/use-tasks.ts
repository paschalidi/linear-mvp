'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '@/actions/tasks';
import { Task, UpdateTaskRequest, Status } from '@/types/task';
import { toast } from 'sonner';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: ['tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
};

// Hooks
export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: getTasks,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Update the tasks list cache
      queryClient.setQueryData<Task[]>(taskKeys.all, (old) => {
        return old ? [newTask, ...old] : [newTask];
      });

      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });

      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskRequest }) =>
      updateTask({ id, updates }),
    onSuccess: (updatedTask) => {
      // Update the tasks list cache
      queryClient.setQueryData<Task[]>(taskKeys.all, (old) => {
        return old?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ) || [];
      });

      // Update the individual task cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);

      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });

      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update task');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteTask({ id }),
    onSuccess: (_, { id: deletedId }) => {
      // Remove from tasks list cache
      queryClient.setQueryData<Task[]>(taskKeys.all, (old) => {
        return old?.filter((task) => task.id !== deletedId) || [];
      });

      // Remove from individual task cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(deletedId) });

      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.all });

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

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      updateTask({ id, updates: { status } }),
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.all);

      // Optimistically update to the new value
      queryClient.setQueryData<Task[]>(taskKeys.all, (old) => {
        return old?.map((task) =>
          task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task
        ) || [];
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.all, context.previousTasks);
      }
      toast.error(error.message || 'Failed to update task status');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
