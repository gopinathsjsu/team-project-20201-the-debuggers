import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import {
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  getRestaurantBookings,
  updateBookingStatus,
} from '../controllers/bookingController';
import { isRestaurantOwner } from '../middleware/restaurantAuth';

const router = Router();

// Create booking
router.post(
  '/',
  [
    body('restaurantId').isInt().withMessage('Restaurant ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required (HH:MM)'),
    body('partySize').isInt({ min: 1 }).withMessage('Party size must be at least 1'),
  ],
  validate,
  createBooking
);

// Get booking by ID
router.get('/:id', getBooking);

// Get user's bookings
router.get('/user/:userId', getUserBookings);

// Get restaurant's bookings (restaurant owner only)
router.get('/restaurant/:restaurantId', isRestaurantOwner, getRestaurantBookings);

// Update booking
router.put(
  '/:id',
  [
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('time')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Valid time is required (HH:MM)'),
    body('partySize').optional().isInt({ min: 1 }).withMessage('Party size must be at least 1'),
  ],
  validate,
  updateBooking
);

// Update booking status (restaurant owner only)
router.patch(
  '/:id/status',
  isRestaurantOwner,
  [
    body('status')
      .isIn(['pending', 'confirmed', 'cancelled'])
      .withMessage('Status must be pending, confirmed, or cancelled'),
  ],
  validate,
  updateBookingStatus
);

// Delete booking
router.delete('/:id', deleteBooking);

export default router; 