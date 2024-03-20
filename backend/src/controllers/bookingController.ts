import { Request, Response } from 'express';
import { db } from '../config/database';
import { CustomError } from '../middleware/errorHandler';
import { BookingSchema, BookingCreationSchema, BookingUpdateSchema } from '../models/Booking';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const bookingData = BookingCreationSchema.parse({
      ...req.body,
      userId: req.user?.id,
    });

    // Check if restaurant exists and has capacity
    const [restaurants] = await db.query('SELECT * FROM restaurants WHERE id = ?', [
      bookingData.restaurantId,
    ]);
    const restaurant = (restaurants as any[])[0];

    if (!restaurant) {
      throw { statusCode: 404, message: 'Restaurant not found' } as CustomError;
    }

    // Check if there's available capacity for the requested time
    const [existingBookings] = await db.query(
      'SELECT SUM(party_size) as total_guests FROM bookings WHERE restaurant_id = ? AND date = ? AND time = ? AND status = "confirmed"',
      [bookingData.restaurantId, bookingData.date, bookingData.time]
    );
    
    const totalGuests = (existingBookings as any[])[0].total_guests || 0;
    if (totalGuests + bookingData.partySize > restaurant.capacity) {
      throw { statusCode: 400, message: 'Restaurant is fully booked for this time' } as CustomError;
    }

    // Create booking
    const [result] = await db.query(
      'INSERT INTO bookings (user_id, restaurant_id, date, time, party_size, status, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        bookingData.userId,
        bookingData.restaurantId,
        bookingData.date,
        bookingData.time,
        bookingData.partySize,
        'pending',
        bookingData.specialRequests,
      ]
    );

    res.status(201).json({
      success: true,
      booking: {
        id: (result as any).insertId,
        ...bookingData,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const [bookings] = await db.query('SELECT * FROM bookings WHERE user_id = ?', [req.user?.id]);
    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    throw error;
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user?.id,
    ]);
    const booking = (bookings as any[])[0];

    if (!booking) {
      throw { statusCode: 404, message: 'Booking not found' } as CustomError;
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    throw error;
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingData = BookingUpdateSchema.parse(req.body);
    
    // Check if booking exists and user owns it
    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    const booking = (bookings as any[])[0];

    if (!booking) {
      throw { statusCode: 404, message: 'Booking not found' } as CustomError;
    }

    if (booking.user_id !== req.user?.id) {
      throw { statusCode: 403, message: 'Not authorized' } as CustomError;
    }

    // Update booking
    await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [bookingData.status, req.params.id]
    );

    res.json({
      success: true,
      message: 'Booking updated successfully',
    });
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    // Check if booking exists and user owns it
    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user?.id,
    ]);
    const booking = (bookings as any[])[0];

    if (!booking) {
      throw { statusCode: 404, message: 'Booking not found' } as CustomError;
    }

    // Cancel booking
    await db.query(
      'UPDATE bookings SET status = "cancelled" WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    throw error;
  }
}; 