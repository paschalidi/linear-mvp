'use client';

import { useState } from 'react';
import { Task, Status } from '@/types/task';
import { TaskCard } from './task-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDrop: (taskId: string, newStatus: Status) => void;
  draggedTaskId: string | null;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
}

const columnConfig = {
  [Status.TODO]: {
    bgColor: 'bg-background',
    headerColor: 'text-foreground',
    countColor: 'bg-muted text-muted-foreground',
  },
  [Status.IN_PROGRESS]: {
    bgColor: 'bg-background',
    headerColor: 'text-foreground',
    countColor: 'bg-muted text-muted-foreground',
  },
  [Status.DONE]: {
    bgColor: 'bg-background',
    headerColor: 'text-foreground',
    countColor: 'bg-muted text-muted-foreground',
  },
};

export function TaskColumn({
  status,
  title,
  tasks,
  onTaskClick,
  onTaskDrop,
  draggedTaskId,
  onDragStart,
  onDragEnd
}: TaskColumnProps) {
  const config = columnConfig[status];
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onTaskDrop(taskId, status);
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className={cn('font-medium text-sm', config.headerColor)}>
            {title}
          </h2>
          <Badge
            variant="secondary"
            className={cn('text-xs font-medium px-2 py-0.5', config.countColor)}
          >
            {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Tasks Container */}
      <div className={cn(
        'flex-1 p-3 space-y-2 overflow-y-auto rounded-b-lg transition-colors duration-200',
        config.bgColor,
        isDragOver && 'bg-muted/50 ring-2 ring-primary/20 ring-inset'
      )}>
        {tasks.length === 0 ? (
          <div className={cn(
            "flex items-center justify-center h-32 text-muted-foreground text-sm transition-all duration-200",
            isDragOver && "text-primary/70"
          )}>
            {isDragOver && 'Drop here'}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedTaskId === task.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
