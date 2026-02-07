import { Router } from 'express';
import {
  addDirector,
  getDirectors,
  updateDirector,
  deleteDirector,
} from '../controllers/director.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   POST /api/v1/directors
 * @desc    Add a new director
 * @access  Private
 */
router.post(
  '/',
  validateRequest([
    { field: 'businessId', required: true },
    { field: 'name', required: true, minLength: 2, maxLength: 200 },
  ]),
  addDirector
);

/**
 * @route   GET /api/v1/directors/:businessId
 * @desc    Get all directors for a business
 * @access  Private
 */
router.get('/:businessId', getDirectors);

/**
 * @route   PATCH /api/v1/directors/:id
 * @desc    Update director information
 * @access  Private
 */
router.patch('/:id', updateDirector);

/**
 * @route   DELETE /api/v1/directors/:id
 * @desc    Delete a director
 * @access  Private
 */
router.delete('/:id', deleteDirector);

export default router;
