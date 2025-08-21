'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useAuthContext } from '@/lib/providers/auth-provider';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  onAddTask?: () => void;
  className?: string;
}

export function AppLayout({
  children,
  onAddTask,
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
      {/* Sidebar - hidden on mobile (< md breakpoint) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          onAddTask={onAddTask}
        />

        {/* Main content */}
        <main className={cn("flex-1 overflow-y-auto bg-background", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
