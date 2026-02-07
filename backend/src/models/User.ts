import { pool } from '../config/database';

/**
 * User interface for type safety
 */
export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  password_hash?: string;
  role: 'owner' | 'ops';
  created_at: Date;
  updated_at: Date;
}

/**
 * Create user data interface
 */
export interface CreateUserData {
  name: string;
  phone: string;
  email?: string;
  password_hash?: string;
  role?: 'owner' | 'ops';
}

/**
 * User Model - handles all database operations for users
 */
export class UserModel {
  /**
   * Create a new user
   */
  static async create(userData: CreateUserData): Promise<User> {
    const { name, phone, email, password_hash, role = 'owner' } = userData;
    
    const query = `
      INSERT INTO users (name, phone, email, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role, created_at, updated_at
    `;
    
    const values = [name, phone, email || null, password_hash || null, role];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0] as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Find user by phone number
   */
  static async findByPhone(phone: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, phone, password_hash, role, created_at, updated_at
      FROM users
      WHERE phone = $1
    `;
    
    try {
      const result = await pool.query(query, [phone]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by phone:', error);
      throw error;
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, phone, password_hash, role, created_at, updated_at
      FROM users
      WHERE email = $1
    `;
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, phone, password_hash, role, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email, phone, role, created_at, updated_at
    `;
    
    try {
      const result = await pool.query(query, [hashedPassword, userId]);
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      return result.rows[0] as User;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Get user without password hash (safe for API responses)
   */
  static sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...sanitized } = user as any;
    return sanitized;
  }
}