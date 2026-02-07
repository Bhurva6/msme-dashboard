import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface DocumentData {
  document_group_id: string;
  file_name: string;
  file_url: string;
  mime_type: string;
  file_size_bytes: number;
}

export interface Document extends DocumentData {
  id: string;
  uploaded_at: string;
}

export class DocumentModel {
  /**
   * Create a new document record
   */
  static async create(documentData: DocumentData): Promise<Document> {
    const { document_group_id, file_name, file_url, mime_type, file_size_bytes } = documentData;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO documents 
       (document_group_id, file_name, file_url, mime_type, file_size_bytes) 
       VALUES (?, ?, ?, ?, ?)`,
      [document_group_id, file_name, file_url, mime_type, file_size_bytes]
    );

    const documentId = result.insertId.toString();
    const document = await this.findById(documentId);
    
    if (!document) {
      throw new Error('Failed to create document');
    }

    return document;
  }

  /**
   * Find document by ID
   */
  static async findById(id: string): Promise<Document | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM documents WHERE id = ? LIMIT 1',
      [id]
    );

    return rows.length > 0 ? (rows[0] as Document) : null;
  }

  /**
   * Find all documents in a group
   */
  static async findByGroupId(groupId: string): Promise<Document[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM documents WHERE document_group_id = ? ORDER BY uploaded_at DESC',
      [groupId]
    );

    return rows as Document[];
  }

  /**
   * Find all documents for a business (across all groups)
   */
  static async findByBusinessId(businessId: string): Promise<Document[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT d.* FROM documents d
       INNER JOIN document_groups dg ON d.document_group_id = dg.id
       WHERE dg.business_id = ?
       ORDER BY d.uploaded_at DESC`,
      [businessId]
    );

    return rows as Document[];
  }

  /**
   * Find documents by business and group type
   */
  static async findByBusinessAndType(
    businessId: string,
    type: string
  ): Promise<Document[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT d.* FROM documents d
       INNER JOIN document_groups dg ON d.document_group_id = dg.id
       WHERE dg.business_id = ? AND dg.type = ?
       ORDER BY d.uploaded_at DESC`,
      [businessId, type]
    );

    return rows as Document[];
  }

  /**
   * Count documents in a group
   */
  static async countByGroupId(groupId: string): Promise<number> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM documents WHERE document_group_id = ?',
      [groupId]
    );

    return rows[0].count;
  }

  /**
   * Delete a document
   */
  static async delete(documentId: string): Promise<void> {
    await pool.execute('DELETE FROM documents WHERE id = ?', [documentId]);
  }

  /**
   * Delete all documents in a group
   */
  static async deleteByGroupId(groupId: string): Promise<void> {
    await pool.execute('DELETE FROM documents WHERE document_group_id = ?', [groupId]);
  }

  /**
   * Get total storage used by a business (in bytes)
   */
  static async getTotalStorageUsed(businessId: string): Promise<number> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT SUM(d.file_size_bytes) as total FROM documents d
       INNER JOIN document_groups dg ON d.document_group_id = dg.id
       WHERE dg.business_id = ?`,
      [businessId]
    );

    return rows[0].total || 0;
  }

  /**
   * Get file statistics for a business
   */
  static async getFileStats(businessId: string): Promise<{
    totalFiles: number;
    totalSize: number;
    byType: { [key: string]: number };
  }> {
    const documents = await this.findByBusinessId(businessId);
    
    const stats = {
      totalFiles: documents.length,
      totalSize: documents.reduce((sum, doc) => sum + doc.file_size_bytes, 0),
      byType: {} as { [key: string]: number },
    };

    // Count by MIME type
    documents.forEach(doc => {
      stats.byType[doc.mime_type] = (stats.byType[doc.mime_type] || 0) + 1;
    });

    return stats;
  }
}
