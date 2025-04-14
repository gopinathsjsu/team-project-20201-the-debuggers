import pool from '../config/database';
import { Booking, BookingCreateInput, BookingUpdateInput } from '../types/booking';

export class BookingModel {
  // Create a new booking
  static async create(input: BookingCreateInput): Promise<Booking> {
    const { userId, restaurantId, date, time, partySize } = input;
    
    const result = await pool.query(
      `INSERT INTO bookings (user_id, restaurant_id, date, time, party_size, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id, user_id, restaurant_id, date, time, party_size, status, created_at, updated_at`,
      [userId, restaurantId, date, time, partySize]
    );
    
    return this.mapRowToBooking(result.rows[0]);
  }
  
  // Find booking by ID
  static async findById(id: number): Promise<Booking | null> {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToBooking(result.rows[0]);
  }
  
  // Find bookings by user ID
  static async findByUserId(userId: number): Promise<Booking[]> {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1',
      [userId]
    );
    
    return result.rows.map(this.mapRowToBooking);
  }
  
  // Find bookings by restaurant ID
  static async findByRestaurantId(restaurantId: number): Promise<Booking[]> {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE restaurant_id = $1',
      [restaurantId]
    );
    
    return result.rows.map(this.mapRowToBooking);
  }
  
  // Find bookings by date range
  static async findByDateRange(
    restaurantId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Booking[]> {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE restaurant_id = $1 AND date BETWEEN $2 AND $3',
      [restaurantId, startDate, endDate]
    );
    
    return result.rows.map(this.mapRowToBooking);
  }
  
  // Update booking
  static async update(id: number, input: BookingUpdateInput): Promise<Booking | null> {
    const { date, time, partySize, status } = input;
    
    const result = await pool.query(
      `UPDATE bookings
       SET date = COALESCE($1, date),
           time = COALESCE($2, time),
           party_size = COALESCE($3, party_size),
           status = COALESCE($4, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, user_id, restaurant_id, date, time, party_size, status, created_at, updated_at`,
      [date, time, partySize, status, id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToBooking(result.rows[0]);
  }
  
  // Delete booking
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rows.length > 0;
  }
  
  // Update booking status
  static async updateStatus(id: number, status: 'pending' | 'confirmed' | 'cancelled'): Promise<Booking | null> {
    const result = await pool.query(
      `UPDATE bookings
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, user_id, restaurant_id, date, time, party_size, status, created_at, updated_at`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToBooking(result.rows[0]);
  }
  
  // Helper method to map database row to Booking object
  private static mapRowToBooking(row: any): Booking {
    return {
      id: row.id,
      userId: row.user_id,
      restaurantId: row.restaurant_id,
      date: row.date,
      time: row.time,
      partySize: row.party_size,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
} 