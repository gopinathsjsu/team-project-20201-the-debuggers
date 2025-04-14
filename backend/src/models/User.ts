import { Pool } from 'pg';
import bcrypt from 'bcrypt';

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