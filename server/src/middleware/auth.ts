import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { ApiResponse } from '../types/task';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Middleware to authenticate JWT tokens from Authorization header
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Access token required'
    };
    res.status(401).json(response);
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Invalid or expired token'
    };
    res.status(403).json(response);
  }
};
