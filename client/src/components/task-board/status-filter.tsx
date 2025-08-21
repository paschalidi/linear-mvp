'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown } from 'lucide-react';
import { Status } from '@/types/task';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface StatusFilterProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

interface FilterFormData {
  status: string;
}

const statusOptions = [
  {
    value: 'all',
    label: 'All statuses',
    color: 'text-muted-foreground'
  },
  {
    value: Status.TODO,
    label: 'Backlog',
    color: 'text-gray-500'
  },
  {
    value: Status.IN_PROGRESS,
    label: 'In Progress',
    color: 'text-blue-500'
  },
  {
    value: Status.DONE,
    label: 'Done',
    color: 'text-green-500'
  },
];

/**
 * Status filter component with Linear-inspired design
 *
 * Features:
 * - Clean button-based filter pills
 * - Direct URL updates on selection change
 * - Syncs with URL on navigation
 * - Modern Linear-inspired design
 */
export function StatusFilter({ className }: StatusFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setValue, watch } = useForm<FilterFormData>({
    defaultValues: {
      status: searchParams.get('status') || 'all'
    }
  });

  const currentStatus = watch('status');

  const handleStatusChange = (value: string) => {
    setValue('status', value);

    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'all') {
      params.set('status', value);
    } else {
      params.delete('status');
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl);
  };

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      {/* Filter Pills */}
      <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg border border-border/50">
        {statusOptions.map((option) => {
          const isActive = currentStatus === option.value;
          return (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(option.value)}
              className={`
                h-8 px-3 text-xs font-medium transition-all duration-200 rounded-md
                ${isActive
                  ? 'bg-background shadow-sm border border-border/50 text-foreground'
                  : 'hover:bg-background/50 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}