'use client';

import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/task-board/search-input';
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
      "flex h-14 items-center justify-between border-b border-border bg-background px-6",
      className
    )}>
      {/* Center and Right side - Search and Actions */}
      <div className="flex items-center gap-4 flex-1 justify-between">
        {/* Search */}
        <SearchInput />

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Filter button */}
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          {/* Add task button */}
          {onAddTask && (
            <Button onClick={onAddTask} size="sm" className="h-8 px-3">
              <Plus className="h-4 w-4 mr-2" />
              New issue
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
