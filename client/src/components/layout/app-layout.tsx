'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useAuthContext } from '@/lib/providers/auth-provider';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onAddTask?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
}

export function AppLayout({
  children,
  title,
  subtitle,
  onAddTask,
  searchQuery,
  onSearchChange,
  className
}: AppLayoutProps) {
  const { isAuthenticated } = useAuthContext();

  // For non-authenticated pages (login/register), don't show sidebar
  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          title={title}
          subtitle={subtitle}
          onAddTask={onAddTask}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        {/* Main content */}
        <main className={cn("flex-1 overflow-y-auto bg-background", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
