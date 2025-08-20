'use client';

import { useState } from 'react';
import { Status, CreateTaskRequest } from '@/types/task';
import { useCreateTask } from '@/lib/hooks/use-tasks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus?: Status;
}

const statusOptions = [
  { value: Status.TODO, label: 'Backlog' },
  { value: Status.IN_PROGRESS, label: 'In Progress' },
  { value: Status.DONE, label: 'Done' },
];

export function AddTaskModal({ open, onOpenChange, defaultStatus = Status.TODO }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(defaultStatus);
  
  const createTaskMutation = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const taskData: CreateTaskRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    };

    try {
      await createTaskMutation.mutateAsync(taskData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to create task:', error);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setStatus(defaultStatus);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new issue</DialogTitle>
          <DialogDescription>
            Add a new issue to your board. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter issue title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter issue description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
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
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? 'Creating...' : 'Create issue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
