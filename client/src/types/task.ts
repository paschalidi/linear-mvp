export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TaskColumn {
  id: Status;
  title: string;
  tasks: Task[];
}
