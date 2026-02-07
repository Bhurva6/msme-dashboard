import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface BusinessData {
  owner_id: string;
  legal_name: string;
  business_name?: string;
  entity_type: 'SOLE_PROPRIETOR' | 'PARTNERSHIP' | 'PRIVATE_LIMITED' | 'LLP' | 'PUBLIC_LIMITED';
  pan?: string;
  gstin?: string;
  udyam?: string;
  sector: string;
  city: string;
  state: string;
  brief_description?: string;
  profile_completion_percent?: number;
}

export interface Business extends BusinessData {
  id: string;
  created_at: string;
  updated_at: string;
}

export class BusinessModel {
  /**
   * Create a new business profile
   */
  static async create(businessData: BusinessData): Promise<Business> {
    const {
      owner_id,
      legal_name,
      business_name,
      entity_type,
      pan,
      gstin,
      udyam,
      sector,
      city,
      state,
      brief_description,
    } = businessData;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO businesses 
       (owner_id, legal_name, business_name, entity_type, pan, gstin, udyam, sector, city, state, brief_description, profile_completion_percent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        owner_id,
        legal_name,
        business_name || null,
        entity_type,
        pan || null,
        gstin || null,
        udyam || null,
        sector,
        city,
        state,
        brief_description || null,
        10, // Initial completion: 10% for basic info
      ]
    );

    const businessId = result.insertId.toString();
    const business = await this.findById(businessId);
    
    if (!business) {
      throw new Error('Failed to create business');
    }

    return business;
  }

  /**
   * Find business by owner ID
   */
  static async findByOwnerId(ownerId: string): Promise<Business | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM businesses WHERE owner_id = ? LIMIT 1',
      [ownerId]
    );

    return rows.length > 0 ? (rows[0] as Business) : null;
  }

  /**
   * Find business by ID
   */
  static async findById(id: string): Promise<Business | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM businesses WHERE id = ? LIMIT 1',
      [id]
    );

    return rows.length > 0 ? (rows[0] as Business) : null;
  }

  /**
   * Update business details
   */
  static async update(id: string, businessData: Partial<BusinessData>): Promise<Business> {
    const fields: string[] = [];
    const values: any[] = [];

    // Build dynamic update query
    Object.entries(businessData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'owner_id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      const business = await this.findById(id);
      if (!business) {
        throw new Error('Business not found');
      }
      return business;
    }

    // Add updated_at timestamp
    fields.push('updated_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE businesses SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const business = await this.findById(id);
    if (!business) {
      throw new Error('Business not found after update');
    }

    return business;
  }

  /**
   * Calculate profile completion percentage
   */
  static async calculateProfileCompletion(businessId: string): Promise<number> {
    const business = await this.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    let completionPercent = 0;

    // Business info (10%): Name, entity type, PAN, sector, city filled
    if (
      business.legal_name &&
      business.entity_type &&
      business.sector &&
      business.city &&
      business.state
    ) {
      completionPercent += 10;
    }

    // Get document groups for this business
    const [docGroups] = await pool.execute<RowDataPacket[]>(
      'SELECT type, status FROM document_groups WHERE business_id = ?',
      [businessId]
    );

    // BS & P&L (20%): At least 1 file uploaded
    const bsPnl = docGroups.find((g: any) => g.type === 'BS_PNL');
    if (bsPnl && (bsPnl.status === 'IN_PROGRESS' || bsPnl.status === 'COMPLETE')) {
      completionPercent += 20;
    }

    // Sanctions (20%): At least 1 file uploaded
    const sanction = docGroups.find((g: any) => g.type === 'SANCTION');
    if (sanction && (sanction.status === 'IN_PROGRESS' || sanction.status === 'COMPLETE')) {
      completionPercent += 20;
    }

    // Business Profile (10%): At least 1 file or description
    const profile = docGroups.find((g: any) => g.type === 'PROFILE');
    if (
      (profile && (profile.status === 'IN_PROGRESS' || profile.status === 'COMPLETE')) ||
      (business.brief_description && business.brief_description.length > 50)
    ) {
      completionPercent += 10;
    }

    // KYC Directors (20%): All directors have PAN, Aadhaar, address proof
    const [directors] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM directors WHERE business_id = ?',
      [businessId]
    );

    if (directors.length > 0) {
      const allDirectorsComplete = directors.every(
        (d: any) => d.pan && d.aadhaar_number
      );
      
      const kycDirector = docGroups.find((g: any) => g.type === 'KYC_DIRECTOR');
      if (allDirectorsComplete && kycDirector && kycDirector.status === 'COMPLETE') {
        completionPercent += 20;
      } else if (kycDirector && kycDirector.status === 'IN_PROGRESS') {
        completionPercent += 10; // Partial credit
      }
    }

    // ITR Directors (20%): At least 1 ITR file per director
    const itrDirector = docGroups.find((g: any) => g.type === 'ITR_DIRECTOR');
    if (itrDirector && directors.length > 0) {
      if (itrDirector.status === 'COMPLETE') {
        completionPercent += 20;
      } else if (itrDirector.status === 'IN_PROGRESS') {
        completionPercent += 10; // Partial credit
      }
    }

    return Math.min(completionPercent, 100);
  }

  /**
   * Update profile completion percentage
   */
  static async updateCompletionPercent(businessId: string, percent: number): Promise<void> {
    await pool.execute(
      'UPDATE businesses SET profile_completion_percent = ?, updated_at = NOW() WHERE id = ?',
      [percent, businessId]
    );
  }

  /**
   * Check if business exists for owner
   */
  static async existsForOwner(ownerId: string): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM businesses WHERE owner_id = ?',
      [ownerId]
    );

    return rows[0].count > 0;
  }

  /**
   * Delete business (soft delete by marking as inactive)
   */
  static async delete(id: string): Promise<void> {
    await pool.execute(
      'UPDATE businesses SET updated_at = NOW() WHERE id = ?',
      [id]
    );
  }
}
