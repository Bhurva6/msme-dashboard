import { Router } from 'express';
import {
  createBusiness,
  getMyBusiness,
  updateBusiness,
  getProfileCompletion,
} from '../controllers/business.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/v1/businesses
 * @desc    Create a new business profile
 * @access  Private
 */
router.post(
  '/',
  validateRequest([
    { field: 'legal_name', required: true, minLength: 2, maxLength: 500 },
    { field: 'entity_type', required: true },
    { field: 'sector', required: true },
    { field: 'city', required: true },
    { field: 'state', required: true },
  ]),
  createBusiness
);

/**
 * @route   GET /api/v1/businesses/me
 * @desc    Get business profile for current user
 * @access  Private
 */
router.get('/me', getMyBusiness);

/**
 * @route   PATCH /api/v1/businesses/:id
 * @desc    Update business profile
 * @access  Private
 */
router.patch('/:id', updateBusiness);

/**
 * @route   GET /api/v1/businesses/:id/completion
 * @desc    Get profile completion details
 * @access  Private
 */
router.get('/:id/completion', getProfileCompletion);

export default router;
