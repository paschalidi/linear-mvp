import { Task } from '@prisma/client';
import { TaskResponse } from '../types/task';

/**
 * Transforms a Prisma Task model to TaskResponse format
 * @param task - The task from Prisma database
 * @returns TaskResponse with properly formatted dates
 */
export const transformTask = (task: Task): TaskResponse => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString()
});

/**
 * Transforms multiple Prisma Task models to TaskResponse format
 * @param tasks - Array of tasks from Prisma database
 * @returns Array of TaskResponse with properly formatted dates
 */
export const transformTasks = (tasks: Task[]): TaskResponse[] => 
  tasks.map(transformTask);
