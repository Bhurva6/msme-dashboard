import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DirectorModel } from '../models/Director';
import { BusinessModel } from '../models/Business';
import { ProfileCompletionService } from '../services/profile-completion.service';

/**
 * Add a new director
 * POST /api/v1/directors
 */
export async function addDirector(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const { businessId, name, dob, pan, aadhaar_number, email, phone, address } = req.body;

    if (!businessId || !name) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: businessId, name',
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
        error: 'Not authorized to add directors to this business',
      });
      return;
    }

    // Check if director with same PAN already exists
    if (pan) {
      const existingDirector = await DirectorModel.existsByPAN(businessId, pan);
      if (existingDirector) {
        res.status(409).json({
          success: false,
          error: 'Director with this PAN already exists',
        });
        return;
      }
    }

    // Create director
    const director = await DirectorModel.create({
      business_id: businessId,
      name,
      dob,
      pan,
      aadhaar_number,
      email,
      phone,
      address,
    });

    // Recalculate profile completion
    const completionPercent = await ProfileCompletionService.calculate(businessId);
    await BusinessModel.updateCompletionPercent(businessId, completionPercent);

    res.status(201).json({
      success: true,
      message: 'Director added successfully',
      data: {
        director,
        newCompletion: completionPercent,
      },
    });
  } catch (error: any) {
    console.error('Add director error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add director',
    });
  }
}

/**
 * Get all directors for a business
 * GET /api/v1/directors/:businessId
 */
export async function getDirectors(req: AuthRequest, res: Response): Promise<void> {
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
        error: 'Not authorized to access directors for this business',
      });
      return;
    }

    // Get directors
    const directors = await DirectorModel.findByBusinessId(businessId);

    // Get KYC completion percentage
    const kycCompletion = await DirectorModel.getKYCCompletionPercentage(businessId);

    res.status(200).json({
      success: true,
      data: {
        directors,
        kycCompletion,
      },
    });
  } catch (error: any) {
    console.error('Get directors error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch directors',
    });
  }
}

/**
 * Update director information
 * PATCH /api/v1/directors/:id
 */
export async function updateDirector(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const directorId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Get director
    const director = await DirectorModel.findById(directorId);
    if (!director) {
      res.status(404).json({
        success: false,
        error: 'Director not found',
      });
      return;
    }

    // Verify business ownership
    const business = await BusinessModel.findById(director.business_id);
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
        error: 'Not authorized to update this director',
      });
      return;
    }

    // Update director
    const updatedDirector = await DirectorModel.update(directorId, req.body);

    // Recalculate profile completion
    const completionPercent = await ProfileCompletionService.calculate(director.business_id);
    await BusinessModel.updateCompletionPercent(director.business_id, completionPercent);

    res.status(200).json({
      success: true,
      message: 'Director updated successfully',
      data: {
        director: updatedDirector,
        newCompletion: completionPercent,
      },
    });
  } catch (error: any) {
    console.error('Update director error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update director',
    });
  }
}

/**
 * Delete a director
 * DELETE /api/v1/directors/:id
 */
export async function deleteDirector(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const directorId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Get director
    const director = await DirectorModel.findById(directorId);
    if (!director) {
      res.status(404).json({
        success: false,
        error: 'Director not found',
      });
      return;
    }

    // Verify business ownership
    const business = await BusinessModel.findById(director.business_id);
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
        error: 'Not authorized to delete this director',
      });
      return;
    }

    const businessId = director.business_id;

    // Delete director
    await DirectorModel.delete(directorId);

    // Recalculate profile completion
    const completionPercent = await ProfileCompletionService.calculate(businessId);
    await BusinessModel.updateCompletionPercent(businessId, completionPercent);

    res.status(200).json({
      success: true,
      message: 'Director deleted successfully',
      data: {
        newCompletion: completionPercent,
      },
    });
  } catch (error: any) {
    console.error('Delete director error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete director',
    });
  }
}
