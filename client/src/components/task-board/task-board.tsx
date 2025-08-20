'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useTasks } from '@/lib/hooks/use-tasks';
import { Task, Status } from '@/types/task';
import { TaskColumn } from './task-column';
import { AddTaskModal } from './add-task-modal';
import { TaskDetailDrawer } from './task-detail-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const columns = [
  {
    id: Status.TODO,
    title: 'Todo',
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
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tasks = [], error } = useTasks();

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailDrawerOpen(true);
  };

  const handleCloseDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedTask(null);
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-slate-900">
                Team Task Board
              </h1>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {columns.map((column) => (
            <div key={column.id} className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <TaskColumn
                status={column.status}
                title={column.title}
                tasks={tasksByStatus[column.status] || []}
                onTaskClick={handleTaskClick}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-slate-300 mb-4">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3c0-1.1.9-2 2-2s2 .9 2 2v8c0 1.1-.9 2-2 2s-2-.9-2-2V3zM9 13c0-1.1.9-2 2-2s2 .9 2 2v8c0 1.1-.9 2-2 2s-2-.9-2-2v-8zM5 7c0-1.1.9-2 2-2s2 .9 2 2v14c0 1.1-.9 2-2 2s-2-.9-2-2V7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No tasks yet
            </h3>
            <p className="text-slate-600 mb-6">
              Get started by creating your first task.
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first task
            </Button>
          </div>
        )}

        {/* No Search Results */}
        {filteredTasks.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-slate-300 mb-4">
              <Search className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No tasks found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search terms or create a new task.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        )}
      </main>

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
    </div>
  );
}
