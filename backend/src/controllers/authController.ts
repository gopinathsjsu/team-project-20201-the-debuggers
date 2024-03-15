import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { CustomError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;

  try {
    // Check if user exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if ((existingUsers as any[]).length > 0) {
      throw { statusCode: 400, message: 'User already exists' } as CustomError;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await db.query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, role]
    );

    const token = jwt.sign(
      { id: (result as any).insertId, email, role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: (result as any).insertId,
        email,
        name,
        role,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = (users as any[])[0];

    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' } as CustomError;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid credentials' } as CustomError;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const [users] = await db.query('SELECT id, email, name, role FROM users WHERE id = ?', [
      req.user?.id,
    ]);
    const user = (users as any[])[0];

    if (!user) {
      throw { statusCode: 404, message: 'User not found' } as CustomError;
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    throw error;
  }
}; 