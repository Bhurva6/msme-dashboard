import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type FundingUtilityType = 'TERM_LOAN' | 'WORKING_CAPITAL' | 'ASSET_FINANCE' | 'SCHEME_LOAN';
export type FundingUtilityStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface FundingUtilityData {
  business_id: string;
  type: FundingUtilityType;
  requested_amount?: number;
  tenure_months?: number;
  purpose?: string;
  security_type?: string;
  security_available?: boolean;
  existing_emis?: number;
  frequency?: string;
  asset_type?: string;
  asset_cost?: number;
  schemes_interested?: string; // JSON string of scheme names
  status?: FundingUtilityStatus;
  notes?: string;
}

export interface FundingUtility extends FundingUtilityData {
  id: string;
  created_at: string;
  updated_at: string;
}

export class FundingUtilityModel {
  /**
   * Create a new funding utility request
   */
  static async create(utilityData: FundingUtilityData): Promise<FundingUtility> {
    const {
      business_id,
      type,
      requested_amount,
      tenure_months,
      purpose,
      security_type,
      security_available,
      existing_emis,
      frequency,
      asset_type,
      asset_cost,
      schemes_interested,
      notes,
    } = utilityData;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO funding_utilities 
       (business_id, type, requested_amount, tenure_months, purpose, security_type, 
        security_available, existing_emis, frequency, asset_type, asset_cost, 
        schemes_interested, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?)`,
      [
        business_id,
        type,
        requested_amount || null,
        tenure_months || null,
        purpose || null,
        security_type || null,
        security_available || false,
        existing_emis || null,
        frequency || null,
        asset_type || null,
        asset_cost || null,
        schemes_interested || null,
        notes || null,
      ]
    );

    const utilityId = result.insertId.toString();
    const utility = await this.findById(utilityId);
    
    if (!utility) {
      throw new Error('Failed to create funding utility');
    }

    return utility;
  }

  /**
   * Find funding utility by ID
   */
  static async findById(id: string): Promise<FundingUtility | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM funding_utilities WHERE id = ? LIMIT 1',
      [id]
    );

    return rows.length > 0 ? (rows[0] as FundingUtility) : null;
  }

  /**
   * Find all funding utilities for a business
   */
  static async findByBusinessId(businessId: string): Promise<FundingUtility[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM funding_utilities WHERE business_id = ? ORDER BY created_at DESC',
      [businessId]
    );

    return rows as FundingUtility[];
  }

  /**
   * Find funding utilities by type
   */
  static async findByType(businessId: string, type: FundingUtilityType): Promise<FundingUtility[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM funding_utilities WHERE business_id = ? AND type = ? ORDER BY created_at DESC',
      [businessId, type]
    );

    return rows as FundingUtility[];
  }

  /**
   * Update funding utility
   */
  static async update(utilityId: string, utilityData: Partial<FundingUtilityData>): Promise<FundingUtility> {
    const fields: string[] = [];
    const values: any[] = [];

    // Build dynamic update query
    Object.entries(utilityData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'business_id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      const utility = await this.findById(utilityId);
      if (!utility) {
        throw new Error('Funding utility not found');
      }
      return utility;
    }

    // Add updated_at timestamp
    fields.push('updated_at = NOW()');
    values.push(utilityId);

    await pool.execute(
      `UPDATE funding_utilities SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const utility = await this.findById(utilityId);
    if (!utility) {
      throw new Error('Funding utility not found after update');
    }

    return utility;
  }

  /**
   * Update status
   */
  static async updateStatus(utilityId: string, status: FundingUtilityStatus): Promise<void> {
    await pool.execute(
      'UPDATE funding_utilities SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, utilityId]
    );
  }

  /**
   * Delete funding utility
   */
  static async delete(utilityId: string): Promise<void> {
    await pool.execute('DELETE FROM funding_utilities WHERE id = ?', [utilityId]);
  }

  /**
   * Count utilities by business
   */
  static async countByBusinessId(businessId: string): Promise<number> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM funding_utilities WHERE business_id = ?',
      [businessId]
    );

    return rows[0].count;
  }

  /**
   * Get total requested amount for a business
   */
  static async getTotalRequestedAmount(businessId: string): Promise<number> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT SUM(requested_amount) as total FROM funding_utilities WHERE business_id = ?',
      [businessId]
    );

    return rows[0].total || 0;
  }

  /**
   * Get utilities by status
   */
  static async findByStatus(businessId: string, status: FundingUtilityStatus): Promise<FundingUtility[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM funding_utilities WHERE business_id = ? AND status = ? ORDER BY created_at DESC',
      [businessId, status]
    );

    return rows as FundingUtility[];
  }

  /**
   * Submit utilities (change status from DRAFT to SUBMITTED)
   */
  static async submitUtilities(businessId: string): Promise<void> {
    await pool.execute(
      `UPDATE funding_utilities 
       SET status = 'SUBMITTED', updated_at = NOW() 
       WHERE business_id = ? AND status = 'DRAFT'`,
      [businessId]
    );
  }
}
