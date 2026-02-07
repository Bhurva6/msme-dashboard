import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface DirectorData {
  business_id: string;
  name: string;
  dob?: string;
  pan?: string;
  aadhaar_number?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Director extends DirectorData {
  id: string;
  created_at: string;
  updated_at: string;
}

export class DirectorModel {
  /**
   * Create a new director
   */
  static async create(directorData: DirectorData): Promise<Director> {
    const { business_id, name, dob, pan, aadhaar_number, email, phone, address } = directorData;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO directors 
       (business_id, name, dob, pan, aadhaar_number, email, phone, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        business_id,
        name,
        dob || null,
        pan || null,
        aadhaar_number || null,
        email || null,
        phone || null,
        address || null,
      ]
    );

    const directorId = result.insertId.toString();
    const director = await this.findById(directorId);
    
    if (!director) {
      throw new Error('Failed to create director');
    }

    return director;
  }

  /**
   * Find director by ID
   */
  static async findById(id: string): Promise<Director | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM directors WHERE id = ? LIMIT 1',
      [id]
    );

    return rows.length > 0 ? (rows[0] as Director) : null;
  }

  /**
   * Find all directors for a business
   */
  static async findByBusinessId(businessId: string): Promise<Director[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM directors WHERE business_id = ? ORDER BY created_at ASC',
      [businessId]
    );

    return rows as Director[];
  }

  /**
   * Update director information
   */
  static async update(directorId: string, directorData: Partial<DirectorData>): Promise<Director> {
    const fields: string[] = [];
    const values: any[] = [];

    // Build dynamic update query
    Object.entries(directorData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'business_id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      const director = await this.findById(directorId);
      if (!director) {
        throw new Error('Director not found');
      }
      return director;
    }

    // Add updated_at timestamp
    fields.push('updated_at = NOW()');
    values.push(directorId);

    await pool.execute(
      `UPDATE directors SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const director = await this.findById(directorId);
    if (!director) {
      throw new Error('Director not found after update');
    }

    return director;
  }

  /**
   * Delete a director
   */
  static async delete(directorId: string): Promise<void> {
    await pool.execute('DELETE FROM directors WHERE id = ?', [directorId]);
  }

  /**
   * Check if director has complete KYC
   */
  static async hasCompleteKYC(directorId: string): Promise<boolean> {
    const director = await this.findById(directorId);
    
    if (!director) {
      return false;
    }

    // Director has complete KYC if they have PAN, Aadhaar, and DOB
    return !!(director.pan && director.aadhaar_number && director.dob);
  }

  /**
   * Get KYC completion percentage for all directors of a business
   */
  static async getKYCCompletionPercentage(businessId: string): Promise<number> {
    const directors = await this.findByBusinessId(businessId);
    
    if (directors.length === 0) {
      return 0;
    }

    let totalFields = 0;
    let completedFields = 0;

    directors.forEach(director => {
      // Count required fields: name, dob, pan, aadhaar
      totalFields += 4;
      
      if (director.name) completedFields++;
      if (director.dob) completedFields++;
      if (director.pan) completedFields++;
      if (director.aadhaar_number) completedFields++;
    });

    return Math.round((completedFields / totalFields) * 100);
  }

  /**
   * Count directors for a business
   */
  static async countByBusinessId(businessId: string): Promise<number> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM directors WHERE business_id = ?',
      [businessId]
    );

    return rows[0].count;
  }

  /**
   * Check if director with PAN exists for business
   */
  static async existsByPAN(businessId: string, pan: string): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM directors WHERE business_id = ? AND pan = ?',
      [businessId, pan]
    );

    return rows[0].count > 0;
  }
}
