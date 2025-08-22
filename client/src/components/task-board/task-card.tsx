'use client';

import { Status, Task } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDragStart?: (task: Task) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

const statusConfig = {
  [Status.TODO]: {
    label: 'Backlog',
    className: 'bg-muted text-muted-foreground',
    dotColor: 'bg-gray-400',
  },
  [Status.IN_PROGRESS]: {
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    dotColor: 'bg-blue-500',
  },
  [Status.DONE]: {
    label: 'Done',
    className: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    dotColor: 'bg-green-500',
  },
};

export function TaskCard({
  task,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false
}: TaskCardProps) {
  const statusInfo = statusConfig[task.status];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(task);
  };

  const handleDragEnd = () => {
    onDragEnd?.();
  };

  const handleClick = (_e: React.MouseEvent) => {
    // Prevent click when dragging
    if (isDragging) return;
    onClick(task);
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-sm border-border/60',
        'hover:border-border hover:shadow-md group bg-card select-none',
        isDragging && 'opacity-50 rotate-1 shadow-lg scale-105',
        'active:cursor-grabbing'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header with ID and status */}
          <div className="flex items-center gap-2">
            <div className={cn('h-2 w-2 rounded-full', statusInfo.dotColor)}/>
            <span className="text-xs font-mono text-muted-foreground">
                {task.id.slice(-6).toUpperCase()}
              </span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-foreground text-sm leading-5 line-clamp-2 group-hover:text-foreground/80">
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-muted-foreground text-xs leading-4 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <time dateTime={task.createdAt}>
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
