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
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    headerColor: 'text-slate-700',
    countColor: 'bg-slate-200 text-slate-700',
  },
  [Status.IN_PROGRESS]: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    headerColor: 'text-blue-700',
    countColor: 'bg-blue-200 text-blue-700',
  },
  [Status.DONE]: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    headerColor: 'text-green-700',
    countColor: 'bg-green-200 text-green-700',
  },
};

export function TaskColumn({ status, title, tasks, onTaskClick }: TaskColumnProps) {
  const config = columnConfig[status];

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <h2 className={cn('font-semibold text-sm', config.headerColor)}>
            {title}
          </h2>
          <Badge
            variant="secondary"
            className={cn('text-xs font-medium', config.countColor)}
          >
            {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Tasks Container */}
      <div className={cn(
        'flex-1 p-4 space-y-3 overflow-y-auto',
        config.bgColor
      )}>
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
            No tasks yet
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
