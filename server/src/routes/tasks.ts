import express from 'express';
import { CreateTaskRequest, UpdateTaskRequest, ApiResponse, TaskResponse, Status, TaskUpdateData } from '../types/task';
import { transformTask, transformTasks } from '../utils/taskTransformer';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../index';

const router = express.Router();

// GET /api/tasks - List all tasks for authenticated user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const tasks = await prisma.task.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const response: ApiResponse<TaskResponse[]> = {
      success: true,
      data: transformTasks(tasks)
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch tasks'
    };
    return res.status(500).json(response);
  }
});

// GET /api/tasks/:id - Get a specific task for authenticated user
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!task) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Task not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<TaskResponse> = {
      success: true,
      data: transformTask(task)
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching task:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch task'
    };
    return res.status(500).json(response);
  }
});

// POST /api/tasks - Create a new task for authenticated user
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, description, status }: CreateTaskRequest = req.body;
    const userId = req.user!.id;

    // Validation
    if (!title || title.trim().length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Title is required'
      };
      return res.status(400).json(response);
    }

    // Validate status if provided
    if (status && !Object.values(Status).includes(status)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid status value'
      };
      return res.status(400).json(response);
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || Status.TODO,
        userId
      }
    });

    const response: ApiResponse<TaskResponse> = {
      success: true,
      data: transformTask(task),
      message: 'Task created successfully'
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Error creating task:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to create task'
    };
    return res.status(500).json(response);
  }
});

// PUT /api/tasks/:id - Update a task for authenticated user
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { title, description, status }: UpdateTaskRequest = req.body;
    const userId = req.user!.id;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTask) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Task not found'
      };
      return res.status(404).json(response);
    }

    // Validation
    if (title !== undefined && title.trim().length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Title cannot be empty'
      };
      return res.status(400).json(response);
    }

    // Validate status if provided
    if (status && !Object.values(Status).includes(status)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid status value'
      };
      return res.status(400).json(response);
    }

    // Prepare update data
    const updateData: TaskUpdateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status !== undefined) updateData.status = status;

    const task = await prisma.task.update({
      where: { id },
      data: updateData
    });

    const response: ApiResponse<TaskResponse> = {
      success: true,
      data: transformTask(task),
      message: 'Task updated successfully'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error updating task:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to update task'
    };
    return res.status(500).json(response);
  }
});

// DELETE /api/tasks/:id - Delete a task for authenticated user
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTask) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Task not found'
      };
      return res.status(404).json(response);
    }

    await prisma.task.delete({
      where: { id }
    });

    const response: ApiResponse<never> = {
      success: true,
      message: 'Task deleted successfully'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error deleting task:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to delete task'
    };
    return res.status(500).json(response);
  }
});

export default router;
