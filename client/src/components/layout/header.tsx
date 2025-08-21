'use client';

import { Plus, Filter, MoreHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onAddTask?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
}

export function Header({
  title,
  subtitle,
  onAddTask,
  searchQuery = '',
  onSearchChange,
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
        {onSearchChange && (
          <div className="relative max-w-lg w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 h-8 bg-muted/30 border-border text-sm focus:bg-background"
            />
          </div>
        )}

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
