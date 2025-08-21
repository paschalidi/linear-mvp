import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskBoard } from '@/components/task-board/task-board';
import { Status } from '@/types/task';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock the task actions
jest.mock('@/actions/tasks', () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

// Mock auth actions
jest.mock('@/actions/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
}));

// Mock auth server
jest.mock('@/lib/auth-server', () => ({
  getCurrentUser: jest.fn(() => Promise.resolve({
    id: '1',
    email: 'test@example.com',
    name: 'Test User'
  })),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock auth hooks
jest.mock('@/lib/hooks/use-auth', () => ({
  useAuth: jest.fn(() => ({
    data: { id: '1', email: 'test@example.com', name: 'Test User' },
    isLoading: false
  })),
  useLogin: jest.fn(),
  useRegister: jest.fn(),
  useLogout: jest.fn(),
}));

// Mock auth context
jest.mock('@/lib/providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuthContext: jest.fn(() => ({
    auth: {
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: null,
      isAuthenticated: true
    },
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true,
  })),
}));

// Mock task hooks
jest.mock('@/lib/hooks/use-tasks', () => ({
  useTasks: jest.fn(),
  useCreateTask: jest.fn(),
  useUpdateTask: jest.fn(),
  useUpdateTaskStatus: jest.fn(),
  useDeleteTask: jest.fn(),
}));

// Mock drag and drop hook
jest.mock('@/lib/hooks/use-drag-drop', () => ({
  useDragDrop: jest.fn(() => ({
    draggedTaskId: null,
    handleDragStart: jest.fn(),
    handleDragEnd: jest.fn(),
    handleTaskDrop: jest.fn(),
  })),
}));



// Mock SearchInput component
jest.mock('@/components/task-board/search-input', () => ({
  SearchInput: () => <input placeholder="Search issues..." data-testid="search-input" />,
}));

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: Status.TODO,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: '1'
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Description 2',
    status: Status.IN_PROGRESS,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: '1'
  },
  {
    id: '3',
    title: 'Test Task 3',
    description: 'Description 3',
    status: Status.DONE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: '1'
  }
];

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('TaskBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock router
    const { useRouter, useSearchParams } = require('next/navigation');
    useRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
    });
    useSearchParams.mockReturnValue(new URLSearchParams());

    // Mock useTasks hook
    const { useTasks } = require('@/lib/hooks/use-tasks');
    useTasks.mockReturnValue({
      data: mockTasks,
      error: null,
      isLoading: false
    });

    // Mock mutation hooks
    const { useCreateTask, useUpdateTask, useUpdateTaskStatus, useDeleteTask } = require('@/lib/hooks/use-tasks');
    useCreateTask.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false
    });
    useUpdateTask.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false
    });
    useUpdateTaskStatus.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false
    });
    useDeleteTask.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false
    });
  });

  it('renders task board with columns', () => {
    render(
      <TestWrapper>
        <TaskBoard />
      </TestWrapper>
    );

    // Check for column titles using more specific selectors
    expect(screen.getAllByText('Backlog')).toHaveLength(3); // One in column header, two in filters
    expect(screen.getAllByText('In Progress')).toHaveLength(3); // One in column header, two in filters (mobile + desktop)
    expect(screen.getAllByText('Done')).toHaveLength(3); // One in column header, two in filters (mobile + desktop)

    // Check for sidebar navigation
    expect(screen.getByText('Issues')).toBeInTheDocument();
    expect(screen.getByText('TaskBoard')).toBeInTheDocument();
  });

  it('displays tasks in correct columns', () => {
    render(
      <TestWrapper>
        <TaskBoard />
      </TestWrapper>
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Test Task 3')).toBeInTheDocument();
  });

  it('shows error state when tasks fail to load', () => {
    const { useTasks } = require('@/lib/hooks/use-tasks');
    useTasks.mockReturnValue({
      data: [],
      error: new Error('Failed to load tasks'),
      isLoading: false
    });

    render(
      <TestWrapper>
        <TaskBoard />
      </TestWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to load tasks. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('renders search input and allows typing', async () => {
    render(
      <TestWrapper>
        <TaskBoard />
      </TestWrapper>
    );

    // Find search input (there are multiple - mobile and desktop)
    const searchInputs = screen.getAllByPlaceholderText(/search/i);
    const searchInput = searchInputs[0]; // Use the first one

    // Verify search input exists and can be typed in
    expect(searchInput).toBeInTheDocument();

    // Type in the search input
    fireEvent.change(searchInput, { target: { value: 'Test search' } });

    // Verify the input value changed
    expect(searchInput).toHaveValue('Test search');
  });

  it('shows no results message when search returns no matches', async () => {
    // Mock search params to simulate a search that returns no results
    const mockSearchParams = new URLSearchParams('q=nonexistent-search-term-xyz');
    (require('next/navigation').useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(
      <TestWrapper>
        <TaskBoard />
      </TestWrapper>
    );

    // The component should show "No issues found" when search returns no results
    await waitFor(() => {
      expect(screen.getByText('No issues found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search terms or filters, or create a new issue.')).toBeInTheDocument();
    });
  });

  it('opens add task modal when add button is clicked', async () => {
    render(
      <TestWrapper>
        <TaskBoard />
      </TestWrapper>
    );

    const addButton = screen.getByText(/new issue/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Create new issue')).toBeInTheDocument();
    });
  });
});
