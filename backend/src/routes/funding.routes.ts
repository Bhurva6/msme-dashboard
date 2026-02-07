import { Router } from 'express';
import {
  createUtility,
  getUtilities,
  updateUtility,
  deleteUtility,
  submitUtilities,
} from '../controllers/funding.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/v1/funding-utilities
 * @desc    Create a new funding utility request
 * @access  Private
 */
router.post(
  '/',
  validateRequest([
    { field: 'businessId', required: true },
    { field: 'type', required: true },
  ]),
  createUtility
);

/**
 * @route   GET /api/v1/funding-utilities/:businessId
 * @desc    Get all funding utilities for a business
 * @access  Private
 */
router.get('/:businessId', getUtilities);

/**
 * @route   PATCH /api/v1/funding-utilities/:id
 * @desc    Update a funding utility
 * @access  Private
 */
router.patch('/:id', updateUtility);

/**
 * @route   DELETE /api/v1/funding-utilities/:id
 * @desc    Delete a funding utility
 * @access  Private
 */
router.delete('/:id', deleteUtility);

/**
 * @route   POST /api/v1/funding-utilities/:businessId/submit
 * @desc    Submit all draft funding utilities
 * @access  Private
 */
router.post('/:businessId/submit', submitUtilities);

export default router;
