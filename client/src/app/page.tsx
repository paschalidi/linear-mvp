import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { TaskBoard } from '@/components/task-board/task-board';
import { getQueryClient } from '@/lib/GetQueryClient';
import { getCurrentUser } from '@/lib/auth-server';
import { getTasks } from '@/actions/tasks';
import { taskKeys } from '@/lib/hooks/use-tasks';

export default async function Home() {
  // Check authentication on server side
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const queryClient = getQueryClient();

  // Prefetch tasks on the server side since we know user is authenticated
  try {
    await queryClient.prefetchQuery({
      queryKey: taskKeys.all,
      queryFn: getTasks,
      staleTime: 30 * 1000,
    });
  } catch (error) {
    // If prefetch fails, tasks will be fetched on client side
    console.error('Failed to prefetch tasks:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskBoard />
    </HydrationBoundary>
  );
}
