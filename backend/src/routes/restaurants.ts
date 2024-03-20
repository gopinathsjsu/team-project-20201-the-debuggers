import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { isRestaurantOwner } from '../middleware/restaurantAuth';
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurantsByOwner,
} from '../controllers/restaurantController';

const router = Router();

// Create restaurant (restaurant owner only)
router.post(
  '/',
  isRestaurantOwner,
  [
    body('name').notEmpty().withMessage('Restaurant name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('cuisine').notEmpty().withMessage('Cuisine type is required'),
    body('priceRange')
      .isIn(['low', 'medium', 'high'])
      .withMessage('Price range must be low, medium, or high'),
  ],
  validateRequest,
  createRestaurant
);

// Get all restaurants with optional filters
router.get('/', getAllRestaurants);

// Get restaurant by ID
router.get('/:id', getRestaurant);

// Get restaurants by owner ID
router.get('/owner/:ownerId', isRestaurantOwner, getRestaurantsByOwner);

// Update restaurant (restaurant owner only)
router.put(
  '/:id',
  isRestaurantOwner,
  [
    body('name').optional().notEmpty().withMessage('Restaurant name cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
    body('cuisine').optional().notEmpty().withMessage('Cuisine type cannot be empty'),
    body('priceRange')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Price range must be low, medium, or high'),
  ],
  validateRequest,
  updateRestaurant
);

// Delete restaurant (restaurant owner only)
router.delete('/:id', isRestaurantOwner, deleteRestaurant);

export default router; 