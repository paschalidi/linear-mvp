'use client';

import { useEffect, useState } from 'react';
import { Status, Task, UpdateTaskRequest } from '@/types/task';
import { useDeleteTask, useUpdateTask } from '@/lib/hooks/use-tasks';
import { Sheet, SheetContent, SheetHeader, SheetTitle, } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Trash2, } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailDrawerProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions = [
  { value: Status.TODO, label: 'Backlog', color: 'bg-muted text-muted-foreground' },
  {
    value: Status.IN_PROGRESS,
    label: 'In Progress',
    color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
  },
  { value: Status.DONE, label: 'Done', color: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' },
];

export function TaskDetailDrawer({ task, open, onOpenChange }: TaskDetailDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(Status.TODO);
  const [isEditing, setIsEditing] = useState(false);
  
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setIsEditing(false);
    }
  }, [task]);

  const handleSave = async () => {
    if (!task || !title.trim()) return;

    const updates: UpdateTaskRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    };

    try {
      await updateTaskMutation.mutateAsync({ id: task.id, updates });
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync({ id: task.id });
        onOpenChange(false);
      } catch (error) {
        // Error is handled by the mutation hook
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleCancel = () => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
    }
    setIsEditing(false);
  };

  const currentStatus = statusOptions.find(option => option.value === status);

  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        {/* Header */}
        <SheetHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-left text-sm font-medium">
                {task.id.slice(-6).toUpperCase()}
              </SheetTitle>
              <Badge
                variant="secondary"
                className={cn('text-xs font-medium px-2 py-0.5', currentStatus?.color)}
              >
                {currentStatus?.label}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 px-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title"
                   className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title</Label>
            {isEditing ? (
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter issue title..."
                className="h-8 text-sm border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
              />
            ) : (
              <div className="py-1">
                <p className="text-sm font-medium text-foreground leading-tight">{task.title}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description"
                   className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</Label>
            {isEditing ? (
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={4}
                className="text-sm border-0 bg-transparent px-0 py-1 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[80px]"
              />
            ) : (
              <div className="py-1">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {task.description || 'No description'}
                </p>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="edit-status"
                   className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
            {isEditing ? (
              <Select value={status} onValueChange={(value: Status) => setStatus(value)}>
                <SelectTrigger className="shadow-none h-8 text-sm border-0 bg-transparent px-0 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="py-1">
                <Badge
                  variant="secondary"
                  className={cn('text-xs font-medium px-2 py-0.5', currentStatus?.color)}
                >
                  {currentStatus?.label}
                </Badge>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Updated</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(task.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Actions Footer */}
        <div className="border-t border-border/50 pt-3 pb-2 bg-background px-4">
          {isEditing ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!title.trim() || updateTaskMutation.isPending}
                  size="sm"
                  className="h-7 px-3 text-xs"
                >
                  {updateTaskMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={updateTaskMutation.isPending}
                  size="sm"
                  className="h-7 px-3 text-xs"
                >
                  Cancel
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={deleteTaskMutation.isPending}
                size="sm"
                className="h-7 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3 h-3 mr-1"/>
                Delete
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-xs"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={deleteTaskMutation.isPending}
                size="sm"
                className="h-7 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3 h-3 mr-1"/>
                Delete
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
