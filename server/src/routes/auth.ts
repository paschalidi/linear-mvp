import express from 'express';
import { prisma } from '../index';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserResponse
} from '../types/auth';
import { ApiResponse } from '../types/task';
import {
  hashPassword,
  comparePassword,
  generateToken,
  isValidEmail,
  isValidPassword
} from '../utils/auth';
import { transformUser } from '../utils/userTransformer';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Validation
    if (!email || !password || !name) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Email, password, and name are required'
      };
      return res.status(400).json(response);
    }

    if (!isValidEmail(email)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid email format'
      };
      return res.status(400).json(response);
    }

    if (!isValidPassword(password)) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Password must be at least 6 characters long'
      };
      return res.status(400).json(response);
    }

    if (name.trim().length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Name cannot be empty'
      };
      return res.status(400).json(response);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User with this email already exists'
      };
      return res.status(409).json(response);
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name.trim()
      }
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: transformUser(user),
        token
      },
      message: 'User registered successfully'
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Error registering user:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to register user'
    };
    return res.status(500).json(response);
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validation
    if (!email || !password) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Email and password are required'
      };
      return res.status(400).json(response);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid email or password'
      };
      return res.status(401).json(response);
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid email or password'
      };
      return res.status(401).json(response);
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: transformUser(user),
        token
      },
      message: 'Login successful'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error logging in user:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to login'
    };
    return res.status(500).json(response);
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<UserResponse> = {
      success: true,
      data: transformUser(user)
    };

    return res.json(response);
  } catch (error) {
    console.error('Error getting current user:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to get user'
    };
    return res.status(500).json(response);
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  try {
    // Clear the auth cookie
    res.clearCookie('auth_token');

    const response: ApiResponse<never> = {
      success: true,
      message: 'Logged out successfully'
    };

    return res.json(response);
  } catch (error) {
    console.error('Error logging out:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to logout'
    };
    return res.status(500).json(response);
  }
});

export default router;
