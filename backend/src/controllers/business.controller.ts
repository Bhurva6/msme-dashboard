import { Request, Response } from 'express';
import { BusinessModel } from '../models/Business';
import { DocumentGroupModel } from '../models/DocumentGroup';
import { ProfileCompletionService } from '../services/profile-completion.service';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Create a new business profile
 * POST /api/v1/businesses
 */
export async function createBusiness(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Check if business already exists for this owner
    const existingBusiness = await BusinessModel.findByOwnerId(userId);
    if (existingBusiness) {
      res.status(409).json({
        success: false,
        error: 'Business profile already exists for this user',
        data: existingBusiness,
      });
      return;
    }

    const {
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
    } = req.body;

    // Validate required fields
    if (!legal_name || !entity_type || !sector || !city || !state) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: legal_name, entity_type, sector, city, state',
      });
      return;
    }

    // Create business
    const business = await BusinessModel.create({
      owner_id: userId,
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
    });

    // Create default document groups
    await DocumentGroupModel.createDefaultGroups(business.id);

    // Calculate initial completion
    const completionPercent = await ProfileCompletionService.calculate(business.id);
    await BusinessModel.updateCompletionPercent(business.id, completionPercent);

    // Fetch updated business
    const updatedBusiness = await BusinessModel.findById(business.id);

    res.status(201).json({
      success: true,
      message: 'Business profile created successfully',
      data: updatedBusiness,
    });
  } catch (error: any) {
    console.error('Create business error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create business profile',
    });
  }
}

/**
 * Get business profile for current user
 * GET /api/v1/businesses/me
 */
export async function getMyBusiness(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const business = await BusinessModel.findByOwnerId(userId);

    if (!business) {
      res.status(404).json({
        success: false,
        error: 'Business profile not found',
      });
      return;
    }

    // Get document groups
    const documentGroups = await DocumentGroupModel.findByBusinessId(business.id);

    res.status(200).json({
      success: true,
      data: {
        business,
        documentGroups,
      },
    });
  } catch (error: any) {
    console.error('Get business error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch business profile',
    });
  }
}

/**
 * Update business profile
 * PATCH /api/v1/businesses/:id
 */
export async function updateBusiness(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const businessId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Verify ownership
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
        error: 'Not authorized to update this business',
      });
      return;
    }

    // Update business
    const updatedBusiness = await BusinessModel.update(businessId, req.body);

    // Recalculate completion
    const completionPercent = await ProfileCompletionService.calculate(businessId);
    await BusinessModel.updateCompletionPercent(businessId, completionPercent);

    // Fetch final business state
    const finalBusiness = await BusinessModel.findById(businessId);

    res.status(200).json({
      success: true,
      message: 'Business profile updated successfully',
      data: finalBusiness,
    });
  } catch (error: any) {
    console.error('Update business error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update business profile',
    });
  }
}

/**
 * Get profile completion details
 * GET /api/v1/businesses/:id/completion
 */
export async function getProfileCompletion(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const businessId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Verify ownership
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
        error: 'Not authorized to access this business',
      });
      return;
    }

    // Get completion details
    const percent = await ProfileCompletionService.calculate(businessId);
    const breakdown = await ProfileCompletionService.getBreakdown(businessId);
    const statusMessage = ProfileCompletionService.getStatusMessage(percent);
    const isFundable = ProfileCompletionService.isFundable(percent);
    const nextSteps = await ProfileCompletionService.getNextSteps(businessId);

    res.status(200).json({
      success: true,
      data: {
        percent,
        breakdown,
        statusMessage,
        isFundable,
        nextSteps,
      },
    });
  } catch (error: any) {
    console.error('Get completion error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch completion details',
    });
  }
}
