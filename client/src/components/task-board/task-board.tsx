'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { useTasks, useUpdateTaskStatus } from '@/lib/hooks/use-tasks';
import { Status, Task } from '@/types/task';
import { TaskColumn } from './task-column';
import { AddTaskModal } from './add-task-modal';
import { TaskDetailDrawer } from './task-detail-drawer';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { useDragDrop } from '@/lib/hooks/use-drag-drop';

const columns = [
  {
    id: Status.TODO,
    title: 'Backlog',
    status: Status.TODO,
  },
  {
    id: Status.IN_PROGRESS,
    title: 'In Progress',
    status: Status.IN_PROGRESS,
  },
  {
    id: Status.DONE,
    title: 'Done',
    status: Status.DONE,
  },
];

export function TaskBoard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const { data: tasks = [], error } = useTasks();
  const updateTaskStatusMutation = useUpdateTaskStatus();

  // Get search query and status filter from URL
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || '';

  // Drag and drop functionality
  const {
    draggedTaskId,
    handleDragStart,
    handleDragEnd,
    handleTaskDrop
  } = useDragDrop();

  // Filter tasks based on search query and status
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    return filtered;
  }, [tasks, searchQuery, statusFilter]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<Status, Task[]>);
  }, [filteredTasks]);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsDetailDrawerOpen(true);
  }, []);

  const handleCloseDetailDrawer = useCallback(() => {
    setIsDetailDrawerOpen(false);
    setSelectedTask(null);
  }, []);

  const handleTaskDropOnColumn = (taskId: string, newStatus: Status) => {
    try {
      updateTaskStatusMutation.mutate({
        id: taskId,
        status: newStatus
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-600 mb-4">
            Failed to load tasks. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      onAddTask={() => setIsAddModalOpen(true)}
    >

      {/* Board Content */}
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {columns.map((column) => (
            <div key={column.id} className="bg-card rounded-lg border border-border shadow-sm">
              <TaskColumn
                status={column.status}
                title={column.title}
                tasks={tasksByStatus[column.status] || []}
                onTaskClick={handleTaskClick}
                onTaskDrop={(taskId, newStatus) => handleTaskDrop(taskId, newStatus, handleTaskDropOnColumn)}
                draggedTaskId={draggedTaskId}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && !searchQuery && !statusFilter && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3c0-1.1.9-2 2-2s2 .9 2 2v8c0 1.1-.9 2-2 2s-2-.9-2-2V3zM9 13c0-1.1.9-2 2-2s2 .9 2 2v8c0 1.1-.9 2-2 2s-2-.9-2-2v-8zM5 7c0-1.1.9-2 2-2s2 .9 2 2v14c0 1.1-.9 2-2 2s-2-.9-2-2V7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No issues yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first issue.
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first issue
            </Button>
          </div>
        )}

        {/* No Filter Results */}
        {filteredTasks.length === 0 && (searchQuery || statusFilter) && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
              <Search className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No issues found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters, or create a new issue.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New issue
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTaskModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      <TaskDetailDrawer
        task={selectedTask}
        open={isDetailDrawerOpen}
        onOpenChange={handleCloseDetailDrawer}
      />
    </AppLayout>
  );
}
