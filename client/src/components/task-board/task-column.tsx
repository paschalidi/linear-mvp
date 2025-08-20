'use client';

import { Task, Status } from '@/types/task';
import { TaskCard } from './task-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
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

export function TaskColumn({ status, title, tasks, onTaskClick }: TaskColumnProps) {
  const config = columnConfig[status];

  return (
    <div className="flex flex-col h-full">
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
        'flex-1 p-3 space-y-2 overflow-y-auto rounded-b-lg',
        config.bgColor
      )}>
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            No issues yet
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
