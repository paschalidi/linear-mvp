import { User } from '@prisma/client';
import { UserResponse } from '../types/auth';

/**
 * Transforms a Prisma User model to UserResponse format
 * @param user - The user from Prisma database
 * @returns UserResponse with properly formatted dates
 */
export const transformUser = (user: User): UserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});

/**
 * Transforms multiple Prisma User models to UserResponse format
 * @param users - Array of users from Prisma database
 * @returns Array of UserResponse with properly formatted dates
 */
export const transformUsers = (users: User[]): UserResponse[] => 
  users.map(transformUser);
