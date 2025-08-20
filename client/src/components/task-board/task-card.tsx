'use client';

import { Task, Status } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isDragging?: boolean;
}

const statusConfig = {
  [Status.TODO]: {
    label: 'Todo',
    className: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  },
  [Status.IN_PROGRESS]: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  },
  [Status.DONE]: {
    label: 'Done',
    className: 'bg-green-100 text-green-700 hover:bg-green-200',
  },
};

export function TaskCard({ task, onClick, isDragging = false }: TaskCardProps) {
  const statusInfo = statusConfig[task.status];

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md border-slate-200',
        'hover:border-slate-300 group',
        isDragging && 'opacity-50 rotate-2 shadow-lg'
      )}
      onClick={() => onClick(task)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with status badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-slate-900 text-sm leading-5 line-clamp-2 group-hover:text-slate-700">
              {task.title}
            </h3>
            <Badge
              variant="secondary"
              className={cn(
                'text-xs font-medium shrink-0',
                statusInfo.className
              )}
            >
              {statusInfo.label}
            </Badge>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-slate-600 text-xs leading-4 line-clamp-3">
              {task.description}
            </p>
          )}

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">
              {task.id.slice(-8).toUpperCase()}
            </span>
            <time dateTime={task.updatedAt}>
              {new Date(task.updatedAt).toLocaleDateString('en-US', {
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
