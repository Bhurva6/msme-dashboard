import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DocumentModel } from '../models/Document';
import { DocumentGroupModel } from '../models/DocumentGroup';
import { BusinessModel } from '../models/Business';
import { ProfileCompletionService } from '../services/profile-completion.service';
import { StorageService, UploadedFile } from '../services/storage.service';

/**
 * Upload a document
 * POST /api/v1/documents/upload
 */
export async function uploadDocument(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const { businessId, documentType } = req.body;
    const file = req.file as UploadedFile;

    if (!file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
      return;
    }

    if (!businessId || !documentType) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: businessId, documentType',
      });
      return;
    }

    // Verify business ownership
    const business = await BusinessModel.findById(businessId);
    if (!business) {
      res.status(404).json({
        success: false,
        error: 'Business not found',
      });
      return;
    }

    if (business.owner_id !== userId) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to upload documents for this business',
      });
      return;
    }

    // Get document group
    const documentGroup = await DocumentGroupModel.getByType(businessId, documentType);
    if (!documentGroup) {
      res.status(404).json({
        success: false,
        error: 'Document group not found',
      });
      return;
    }

    // Upload file to storage
    const uploadResult = await StorageService.uploadFile(file, documentType.toLowerCase());

    if (!uploadResult.success) {
      res.status(400).json({
        success: false,
        error: uploadResult.error || 'File upload failed',
      });
      return;
    }

    // Save document metadata to database
    const document = await DocumentModel.create({
      document_group_id: documentGroup.id,
      file_name: uploadResult.fileName,
      file_url: uploadResult.fileUrl,
      mime_type: uploadResult.mimeType,
      file_size_bytes: uploadResult.fileSize,
    });

    // Update document group status
    await DocumentGroupModel.autoUpdateStatus(documentGroup.id);

    // Recalculate profile completion
    const completionPercent = await ProfileCompletionService.calculate(businessId);
    await BusinessModel.updateCompletionPercent(businessId, completionPercent);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        document,
        newCompletion: completionPercent,
      },
    });
  } catch (error: any) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload document',
    });
  }
}

/**
 * Get documents for a business
 * GET /api/v1/documents/:businessId
 */
export async function getDocuments(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const businessId = req.params.businessId;
    const { type } = req.query;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Verify business ownership
    const business = await BusinessModel.findById(businessId);
    if (!business) {
      res.status(404).json({
        success: false,
        error: 'Business not found',
      });
      return;
    }

    if (business.owner_id !== userId) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to access documents for this business',
      });
      return;
    }

    // Get documents
    let documents;
    if (type && typeof type === 'string') {
      documents = await DocumentModel.findByBusinessAndType(businessId, type);
    } else {
      documents = await DocumentModel.findByBusinessId(businessId);
    }

    // Get document groups
    const documentGroups = await DocumentGroupModel.findByBusinessId(businessId);

    // Organize documents by group
    const documentsByGroup = documentGroups.map(group => ({
      group,
      documents: documents.filter(doc => doc.document_group_id === group.id),
    }));

    res.status(200).json({
      success: true,
      data: {
        documents,
        documentsByGroup,
      },
    });
  } catch (error: any) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch documents',
    });
  }
}

/**
 * Delete a document
 * DELETE /api/v1/documents/:documentId
 */
export async function deleteDocument(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const documentId = req.params.documentId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Get document
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      res.status(404).json({
        success: false,
        error: 'Document not found',
      });
      return;
    }

    // Get document group to find business
    const documentGroup = await DocumentGroupModel.findById(document.document_group_id);
    if (!documentGroup) {
      res.status(404).json({
        success: false,
        error: 'Document group not found',
      });
      return;
    }

    // Verify business ownership
    const business = await BusinessModel.findById(documentGroup.business_id);
    if (!business) {
      res.status(404).json({
        success: false,
        error: 'Business not found',
      });
      return;
    }

    if (business.owner_id !== userId) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this document',
      });
      return;
    }

    // Delete file from storage
    await StorageService.deleteFile(document.file_url);

    // Delete from database
    await DocumentModel.delete(documentId);

    // Update document group status
    await DocumentGroupModel.autoUpdateStatus(documentGroup.id);

    // Recalculate profile completion
    const completionPercent = await ProfileCompletionService.calculate(documentGroup.business_id);
    await BusinessModel.updateCompletionPercent(documentGroup.business_id, completionPercent);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: {
        newCompletion: completionPercent,
      },
    });
  } catch (error: any) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete document',
    });
  }
}

/**
 * Download/get presigned URL for a document
 * GET /api/v1/documents/:documentId/download
 */
export async function downloadDocument(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const documentId = req.params.documentId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Get document
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      res.status(404).json({
        success: false,
        error: 'Document not found',
      });
      return;
    }

    // Get document group to find business
    const documentGroup = await DocumentGroupModel.findById(document.document_group_id);
    if (!documentGroup) {
      res.status(404).json({
        success: false,
        error: 'Document group not found',
      });
      return;
    }

    // Verify business ownership
    const business = await BusinessModel.findById(documentGroup.business_id);
    if (!business) {
      res.status(404).json({
        success: false,
        error: 'Business not found',
      });
      return;
    }

    if (business.owner_id !== userId) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to download this document',
      });
      return;
    }

    // Generate presigned URL (or return direct URL for local storage)
    const downloadUrl = await StorageService.generatePresignedUrl(document.file_url);

    res.status(200).json({
      success: true,
      data: {
        downloadUrl,
        fileName: document.file_name,
        mimeType: document.mime_type,
      },
    });
  } catch (error: any) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate download link',
    });
  }
}
