import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT_MANAGER = 'restaurant_manager',
  ADMIN = 'admin'
}

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  phone?: string;
  created_at: Date;
}

export const UserSchema = z.object({
  id: z.number().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['user', 'restaurant_owner', 'admin']),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserLoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type UserLogin = z.infer<typeof UserLoginSchema>;

export const UserRegistrationSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;

export class UserModel {
  constructor(private pool: Pool) {}

  async create(email: string, password: string, name: string, role: UserRole, phone?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await this.pool.query(
      `INSERT INTO users (email, password, name, role, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, hashedPassword, name, role, phone]
    );
    
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
} 