'use client';

import { useState, useEffect } from 'react';
import { Task, Status, UpdateTaskRequest } from '@/types/task';
import { useUpdateTask, useDeleteTask } from '@/lib/hooks/use-tasks';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailDrawerProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions = [
  { value: Status.TODO, label: 'Todo', color: 'bg-slate-100 text-slate-700' },
  { value: Status.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: Status.DONE, label: 'Done', color: 'bg-green-100 text-green-700' },
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
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-left">Task Details</SheetTitle>
              <SheetDescription className="text-left">
                ID: {task.id.slice(-8).toUpperCase()}
              </SheetDescription>
            </div>
            <Badge
              variant="secondary"
              className={cn('text-xs font-medium', currentStatus?.color)}
            >
              {currentStatus?.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            {isEditing ? (
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-md border">
                <p className="text-sm font-medium">{task.title}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            {isEditing ? (
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description..."
                rows={4}
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-md border min-h-[100px]">
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {task.description || 'No description provided.'}
                </p>
              </div>
            )}
          </div>

          {/* Status */}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={status} onValueChange={(value: Status) => setStatus(value)}>
                <SelectTrigger>
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
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Created</span>
              <span>{new Date(task.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Updated</span>
              <span>{new Date(task.updatedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!title.trim() || updateTaskMutation.isPending}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateTaskMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateTaskMutation.isPending}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                Edit Task
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteTaskMutation.isPending}
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
