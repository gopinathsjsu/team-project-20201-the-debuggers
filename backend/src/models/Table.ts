import { Pool } from 'pg';

export interface Table {
  id: number;
  restaurant_id: number;
  capacity: number;
  table_number: string;
}

export class TableModel {
  constructor(private pool: Pool) {}

  async create(restaurantId: number, capacity: number, tableNumber: string): Promise<Table> {
    const result = await this.pool.query(
      'INSERT INTO tables (restaurant_id, capacity, table_number) VALUES ($1, $2, $3) RETURNING *',
      [restaurantId, capacity, tableNumber]
    );
    
    return result.rows[0];
  }

  async getAvailableTables(
    restaurantId: number,
    date: Date,
    time: string,
    partySize: number
  ): Promise<Table[]> {
    // Convert time string to datetime
    const dateStr = date.toISOString().split('T')[0];
    const requestedDateTime = new Date(`${dateStr}T${time}`);
    
    // Find tables that can accommodate the party size and are not already booked
    const result = await this.pool.query(
      `SELECT t.* FROM tables t
       WHERE t.restaurant_id = $1
       AND t.capacity >= $2
       AND t.id NOT IN (
         SELECT r.table_id FROM reservations r
         WHERE r.restaurant_id = $1
         AND r.reservation_time BETWEEN $3::timestamp - interval '1.5 hours' AND $3::timestamp + interval '1.5 hours'
       )
       ORDER BY t.capacity ASC`,
      [restaurantId, partySize, requestedDateTime]
    );
    
    return result.rows;
  }

  async findByRestaurantId(restaurantId: number): Promise<Table[]> {
    const result = await this.pool.query(
      'SELECT * FROM tables WHERE restaurant_id = $1',
      [restaurantId]
    );
    
    return result.rows;
  }
} 