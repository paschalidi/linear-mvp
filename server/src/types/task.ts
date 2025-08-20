import { Status } from '@prisma/client';

export { Status };

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: Status;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: Status;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TaskUpdateData {
  title?: string;
  description?: string | null;
  status?: Status;
}
