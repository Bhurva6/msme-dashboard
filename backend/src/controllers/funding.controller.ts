import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { FundingUtilityModel } from '../models/FundingUtility';
import { BusinessModel } from '../models/Business';
import { ProfileCompletionService } from '../services/profile-completion.service';

/**
 * Create a new funding utility request
 * POST /api/v1/funding-utilities
 */
export async function createUtility(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const { businessId, type, ...utilityData } = req.body;

    if (!businessId || !type) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: businessId, type',
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
        error: 'Not authorized to create funding utilities for this business',
      });
      return;
    }

    // Check if profile is fundable (>= 70% complete)
    const completionPercent = await ProfileCompletionService.calculate(businessId);
    const isFundable = ProfileCompletionService.isFundable(completionPercent);

    if (!isFundable) {
      res.status(400).json({
        success: false,
        error: `Profile must be at least 70% complete to access funding options. Current: ${completionPercent}%`,
        data: {
          currentCompletion: completionPercent,
          requiredCompletion: 70,
        },
      });
      return;
    }

    // Create funding utility
    const utility = await FundingUtilityModel.create({
      business_id: businessId,
      type,
      ...utilityData,
    });

    res.status(201).json({
      success: true,
      message: 'Funding utility created successfully',
      data: utility,
    });
  } catch (error: any) {
    console.error('Create funding utility error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create funding utility',
    });
  }
}

/**
 * Get all funding utilities for a business
 * GET /api/v1/funding-utilities/:businessId
 */
export async function getUtilities(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const businessId = req.params.businessId;

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
        error: 'Not authorized to access funding utilities for this business',
      });
      return;
    }

    // Get funding utilities
    const utilities = await FundingUtilityModel.findByBusinessId(businessId);

    // Get total requested amount
    const totalRequestedAmount = await FundingUtilityModel.getTotalRequestedAmount(businessId);

    res.status(200).json({
      success: true,
      data: {
        utilities,
        totalRequestedAmount,
      },
    });
  } catch (error: any) {
    console.error('Get funding utilities error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch funding utilities',
    });
  }
}

/**
 * Update a funding utility
 * PATCH /api/v1/funding-utilities/:id
 */
export async function updateUtility(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const utilityId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Get utility
    const utility = await FundingUtilityModel.findById(utilityId);
    if (!utility) {
      res.status(404).json({
        success: false,
        error: 'Funding utility not found',
      });
      return;
    }

    // Verify business ownership
    const business = await BusinessModel.findById(utility.business_id);
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
        error: 'Not authorized to update this funding utility',
      });
      return;
    }

    // Update utility
    const updatedUtility = await FundingUtilityModel.update(utilityId, req.body);

    res.status(200).json({
      success: true,
      message: 'Funding utility updated successfully',
      data: updatedUtility,
    });
  } catch (error: any) {
    console.error('Update funding utility error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update funding utility',
    });
  }
}

/**
 * Delete a funding utility
 * DELETE /api/v1/funding-utilities/:id
 */
export async function deleteUtility(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const utilityId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Get utility
    const utility = await FundingUtilityModel.findById(utilityId);
    if (!utility) {
      res.status(404).json({
        success: false,
        error: 'Funding utility not found',
      });
      return;
    }

    // Verify business ownership
    const business = await BusinessModel.findById(utility.business_id);
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
        error: 'Not authorized to delete this funding utility',
      });
      return;
    }

    // Delete utility
    await FundingUtilityModel.delete(utilityId);

    res.status(200).json({
      success: true,
      message: 'Funding utility deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete funding utility error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete funding utility',
    });
  }
}

/**
 * Submit funding utilities (change status from DRAFT to SUBMITTED)
 * POST /api/v1/funding-utilities/:businessId/submit
 */
export async function submitUtilities(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const businessId = req.params.businessId;

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
        error: 'Not authorized to submit utilities for this business',
      });
      return;
    }

    // Check if there are any draft utilities
    const draftUtilities = await FundingUtilityModel.findByStatus(businessId, 'DRAFT');
    if (draftUtilities.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No draft utilities to submit',
      });
      return;
    }

    // Submit utilities
    await FundingUtilityModel.submitUtilities(businessId);

    // Get updated utilities
    const utilities = await FundingUtilityModel.findByBusinessId(businessId);

    res.status(200).json({
      success: true,
      message: `${draftUtilities.length} funding utilities submitted successfully`,
      data: {
        utilities,
        submittedCount: draftUtilities.length,
      },
    });
  } catch (error: any) {
    console.error('Submit utilities error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit funding utilities',
    });
  }
}
