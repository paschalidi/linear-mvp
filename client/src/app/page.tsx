import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getTasks } from '@/actions/tasks';
import { TaskBoard } from '@/components/task-board/task-board';
import { getQueryClient } from '@/lib/GetQueryClient';

export default async function Home() {
  const queryClient = getQueryClient();

  // Prefetch tasks on the server side
  await queryClient.prefetchQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskBoard />
    </HydrationBoundary>
  );
}
