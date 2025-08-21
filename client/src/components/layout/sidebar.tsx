'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/lib/providers/auth-provider';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Issues', href: '/', icon: Hash },
];

export function Sidebar() {
  const pathname = usePathname();
  const { auth, logout, isLoading } = useAuthContext();

  // Show loading state to prevent screen jumping
  if (isLoading) {
    return (
      <div className="flex h-full w-64 flex-col bg-gray-50 border-r border-gray-200">
        {/* Header */}
        <div className="flex h-14 items-center px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">T</span>
            </div>
            <span className="font-semibold text-gray-900">TaskBoard</span>
          </div>
        </div>

        {/* Navigation skeleton */}
        <nav className="flex-1 px-3 pb-4 overflow-y-auto">
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </nav>

        {/* User section skeleton */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!auth?.user?.email) return null;

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="flex h-14 items-center px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">T</span>
          </div>
          <span className="font-semibold text-gray-900">TaskBoard</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-2 py-1.5 text-sm rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Menu at Bottom */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">
              {auth.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {auth.user.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {auth.user.email}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
