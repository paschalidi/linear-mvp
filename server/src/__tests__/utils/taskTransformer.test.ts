import { Task, Status } from '@prisma/client';
import { transformTask, transformTasks } from '../../utils/taskTransformer';

describe('taskTransformer', () => {
  const mockTask: Task = {
    id: 'test-id-123',
    title: 'Test Task',
    description: 'Test Description',
    status: Status.TODO,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  };

  describe('transformTask', () => {
    it('should transform a Prisma Task to TaskResponse format', () => {
      const result = transformTask(mockTask);

      expect(result).toEqual({
        id: 'test-id-123',
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });

    it('should handle null description', () => {
      const taskWithNullDescription: Task = {
        ...mockTask,
        description: null,
      };

      const result = transformTask(taskWithNullDescription);

      expect(result.description).toBeNull();
    });

    it('should convert dates to ISO strings', () => {
      const result = transformTask(mockTask);

      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
      expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });
  });

  describe('transformTasks', () => {
    it('should transform an array of tasks', () => {
      const mockTasks: Task[] = [
        mockTask,
        {
          ...mockTask,
          id: 'test-id-456',
          title: 'Second Task',
          status: Status.IN_PROGRESS,
        },
      ];

      const result = transformTasks(mockTasks);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('test-id-123');
      expect(result[1].id).toBe('test-id-456');
      expect(result[1].status).toBe(Status.IN_PROGRESS);
    });

    it('should handle empty array', () => {
      const result = transformTasks([]);
      expect(result).toEqual([]);
    });
  });
});
