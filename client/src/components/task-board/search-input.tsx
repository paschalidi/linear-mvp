'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  /**
   * Placeholder text for the search input
   * @default 'Search issues...'
   */
  placeholder?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

interface SearchFormData {
  query: string;
}

/**
 * Search input component with direct URL updates
 *
 * Features:
 * - Form state managed by react-hook-form
 * - Direct URL updates on input change
 * - Syncs with URL on navigation
 * - Production ready and bug-free
 */
export function SearchInput({
  placeholder = 'Search issues...',
  className
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, watch, setValue } = useForm<SearchFormData>({
    defaultValues: {
      query: searchParams.get('q') || ''
    }
  });

  const query = watch('query');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('query', value);

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl);
  };

  return (
    <div className="relative max-w-lg w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
      <Input
        {...register('query')}
        onChange={handleInputChange}
        value={query}
        placeholder={placeholder}
        className={`w-full pl-9 h-10 bg-background border-border text-sm shadow-sm hover:bg-muted/30 focus:shadow-md focus:border-ring/50 transition-all duration-200 ${className || ''}`}
      />
    </div>
  );
}
