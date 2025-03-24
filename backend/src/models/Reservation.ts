import { Pool } from 'pg';

export interface Reservation {
  id: number;
  restaurant_id: number;
  user_id: number;
  table_id: number;
  party_size: number;
  reservation_time: Date;
  status: 'confirmed' | 'cancelled' | 'completed';
  special_request?: string;
  created_at: Date;
}

export class ReservationModel {
  constructor(private pool: Pool) {}

  async create(
    restaurantId: number,
    userId: number,
    tableId: number,
    partySize: number,
    reservationTime: Date,
    specialRequest?: string
  ): Promise<Reservation> {
    const result = await this.pool.query(
      `INSERT INTO reservations (
        restaurant_id, user_id, table_id, party_size, reservation_time, status, special_request
      ) VALUES ($1, $2, $3, $4, $5, 'confirmed', $6)
      RETURNING *`,
      [restaurantId, userId, tableId, partySize, reservationTime, specialRequest]
    );
    
    return result.rows[0];
  }

  async getByUserId(userId: number): Promise<Reservation[]> {
    const result = await this.pool.query(
      `SELECT r.*, res.name as restaurant_name
       FROM reservations r
       JOIN restaurants res ON r.restaurant_id = res.id
       WHERE r.user_id = $1
       ORDER BY r.reservation_time DESC`,
      [userId]
    );
    
    return result.rows;
  }

  async getByRestaurantId(restaurantId: number): Promise<Reservation[]> {
    const result = await this.pool.query(
      `SELECT r.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
       FROM reservations r
       JOIN users u ON r.user_id = u.id
       WHERE r.restaurant_id = $1
       ORDER BY r.reservation_time DESC`,
      [restaurantId]
    );
    
    return result.rows;
  }

  async cancel(id: number): Promise<Reservation | null> {
    const result = await this.pool.query(
      `UPDATE reservations SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [id]
    );
    
    return result.rows[0] || null;
  }
} 