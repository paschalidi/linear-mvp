import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock actions
jest.mock('@/actions/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
}))

// Increase timeout for async operations
jest.setTimeout(10000)
