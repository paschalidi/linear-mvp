import { useState } from 'react';
import { Status, Task } from '@/types/task';

export function useDragDrop() {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleTaskDrop = (taskId: string, newStatus: Status, onUpdateTask: (taskId: string, newStatus: Status) => void) => {
    if (draggedTask && draggedTask.id === taskId && draggedTask.status !== newStatus) {
      // Immediately call the update function which will handle optimistic updates
      onUpdateTask(taskId, newStatus);
    }
    setDraggedTask(null);
  };

  return {
    draggedTask,
    draggedTaskId: draggedTask?.id || null,
    handleDragStart,
    handleDragEnd,
    handleTaskDrop,
  };
}
