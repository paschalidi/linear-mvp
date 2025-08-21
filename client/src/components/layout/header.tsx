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
      "border-b border-border bg-background",
      className
    )}>
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Actions Row */}
        <div className="flex h-16 items-center justify-between px-4">
          <StatusFilter />
          {onAddTask && (
            <Button onClick={onAddTask} size="sm" className="h-10 px-3">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Mobile Search Row */}
        <div className="px-4 pb-4">
          <SearchInput />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-16 items-center gap-6 justify-between px-6">
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
