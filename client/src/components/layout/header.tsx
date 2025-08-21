'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/task-board/search-input';
import { StatusFilter } from '@/components/task-board/status-filter';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onAddTask?: () => void;
  className?: string;
}

export function Header({
  onAddTask,
  className
}: HeaderProps) {
  return (
    <header className={cn(
      "flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6",
      className
    )}>
      {/* Mobile Layout */}
      <div className="flex md:hidden items-center gap-2 flex-1 justify-between">
        {/* Mobile Search */}
        <div className="flex-1 max-w-[200px]">
          <SearchInput />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2">
          <StatusFilter />
          {onAddTask && (
            <Button onClick={onAddTask} size="sm" className="h-10 px-3">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-6 flex-1 justify-between">
        {/* Search and Filter */}
        <div className="flex items-center gap-6 flex-1 max-w-4xl">
          <SearchInput />
          <StatusFilter />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Add task button */}
          {onAddTask && (
            <Button onClick={onAddTask} size="sm" className="h-10 px-4">
              <Plus className="h-4 w-4 mr-2" />
              New issue
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
