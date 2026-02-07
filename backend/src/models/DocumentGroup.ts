import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type DocumentGroupType = 'BS_PNL' | 'SANCTION' | 'PROFILE' | 'KYC_DIRECTOR' | 'ITR_DIRECTOR';
export type DocumentGroupStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE';

export interface DocumentGroup {
  id: string;
  business_id: string;
  type: DocumentGroupType;
  status: DocumentGroupStatus;
  created_at: string;
  updated_at: string;
}

export class DocumentGroupModel {
  /**
   * Create a new document group
   */
  static async create(businessId: string, type: DocumentGroupType): Promise<DocumentGroup> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO document_groups (business_id, type, status) 
       VALUES (?, ?, 'NOT_STARTED')`,
      [businessId, type]
    );

    const groupId = result.insertId.toString();
    const group = await this.findById(groupId);
    
    if (!group) {
      throw new Error('Failed to create document group');
    }

    return group;
  }

  /**
   * Create all default document groups for a business
   */
  static async createDefaultGroups(businessId: string): Promise<DocumentGroup[]> {
    const types: DocumentGroupType[] = ['BS_PNL', 'SANCTION', 'PROFILE', 'KYC_DIRECTOR', 'ITR_DIRECTOR'];
    const groups: DocumentGroup[] = [];

    for (const type of types) {
      const group = await this.create(businessId, type);
      groups.push(group);
    }

    return groups;
  }

  /**
   * Find document group by ID
   */
  static async findById(id: string): Promise<DocumentGroup | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM document_groups WHERE id = ? LIMIT 1',
      [id]
    );

    return rows.length > 0 ? (rows[0] as DocumentGroup) : null;
  }

  /**
   * Find all document groups for a business
   */
  static async findByBusinessId(businessId: string): Promise<DocumentGroup[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM document_groups WHERE business_id = ? ORDER BY type',
      [businessId]
    );

    return rows as DocumentGroup[];
  }

  /**
   * Get specific document group by type
   */
  static async getByType(businessId: string, type: DocumentGroupType): Promise<DocumentGroup | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM document_groups WHERE business_id = ? AND type = ? LIMIT 1',
      [businessId, type]
    );

    return rows.length > 0 ? (rows[0] as DocumentGroup) : null;
  }

  /**
   * Update document group status
   */
  static async updateStatus(groupId: string, status: DocumentGroupStatus): Promise<void> {
    await pool.execute(
      'UPDATE document_groups SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, groupId]
    );
  }

  /**
   * Auto-update status based on document count
   */
  static async autoUpdateStatus(groupId: string): Promise<void> {
    // Count documents in this group
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM documents WHERE document_group_id = ?',
      [groupId]
    );

    const count = rows[0].count;
    let newStatus: DocumentGroupStatus;

    if (count === 0) {
      newStatus = 'NOT_STARTED';
    } else if (count >= 1 && count < 3) {
      newStatus = 'IN_PROGRESS';
    } else {
      newStatus = 'COMPLETE';
    }

    await this.updateStatus(groupId, newStatus);
  }

  /**
   * Get status summary for a business
   */
  static async getStatusSummary(businessId: string): Promise<{
    total: number;
    notStarted: number;
    inProgress: number;
    complete: number;
  }> {
    const groups = await this.findByBusinessId(businessId);

    return {
      total: groups.length,
      notStarted: groups.filter(g => g.status === 'NOT_STARTED').length,
      inProgress: groups.filter(g => g.status === 'IN_PROGRESS').length,
      complete: groups.filter(g => g.status === 'COMPLETE').length,
    };
  }
}
