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
      {/* Left side - Logo and Title */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-foreground">L</span>
          </div>
          <span className="font-semibold text-foreground">Linear</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Center and Right side - Search and Actions */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        {/* Search */}
        {onSearchChange && (
          <div className="relative max-w-md w-full">
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
        <div className="flex items-center gap-2">
          {/* Filter button */}
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          {/* More options */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
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
