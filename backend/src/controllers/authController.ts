import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, UserRole } from '../models/User';

export class AuthController {
  constructor(private userModel: UserModel) {}

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name, phone } = req.body;
      
      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      
      // Create new user (default to customer role)
      const user = await this.userModel.create(email, password, name, UserRole.CUSTOMER, phone);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
      }
      
      // Find user
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Verify password
      const isPasswordValid = await this.userModel.verifyPassword(user, password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
} 