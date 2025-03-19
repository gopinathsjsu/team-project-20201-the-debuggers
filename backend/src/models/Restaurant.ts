import { Pool } from 'pg';

export enum CuisineType {
  ITALIAN = 'Italian',
  CHINESE = 'Chinese',
  INDIAN = 'Indian',
  MEXICAN = 'Mexican',
  JAPANESE = 'Japanese',
  AMERICAN = 'American',
  FRENCH = 'French',
  THAI = 'Thai',
  MEDITERRANEAN = 'Mediterranean',
  OTHER = 'Other'
}

export enum CostRating {
  INEXPENSIVE = '$',
  MODERATE = '$$',
  EXPENSIVE = '$$$',
  VERY_EXPENSIVE = '$$$$'
}

export enum RestaurantStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine_type: CuisineType;
  cost_rating: CostRating;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website?: string;
  opening_time: string;
  closing_time: string;
  manager_id: number;
  status: RestaurantStatus;
  created_at: Date;
  updated_at: Date;
}

export class RestaurantModel {
  constructor(private pool: Pool) {}

  async create(restaurantData: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>): Promise<Restaurant> {
    const result = await this.pool.query(
      `INSERT INTO restaurants (
        name, description, cuisine_type, cost_rating, address, city, state, zip_code,
        phone, email, website, opening_time, closing_time, manager_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        restaurantData.name,
        restaurantData.description,
        restaurantData.cuisine_type,
        restaurantData.cost_rating,
        restaurantData.address,
        restaurantData.city,
        restaurantData.state,
        restaurantData.zip_code,
        restaurantData.phone,
        restaurantData.email,
        restaurantData.website,
        restaurantData.opening_time,
        restaurantData.closing_time,
        restaurantData.manager_id,
        restaurantData.status,
      ]
    );
    
    return result.rows[0];
  }

  async search(
    date: Date,
    time: string,
    partySize: number,
    location?: { city?: string, state?: string, zipCode?: string }
  ): Promise<Restaurant[]> {
    let query = `
      SELECT r.*, 
        (SELECT COUNT(*) FROM reservations WHERE restaurant_id = r.id AND DATE(reservation_time) = CURRENT_DATE) as bookings_today
      FROM restaurants r
      WHERE r.status = 'approved'
    `;
    
    const params: any[] = [];
    let paramCount = 1;
    
    if (location) {
      if (location.zipCode) {
        query += ` AND r.zip_code = $${paramCount}`;
        params.push(location.zipCode);
        paramCount++;
      } else if (location.city && location.state) {
        query += ` AND r.city = $${paramCount} AND r.state = $${paramCount + 1}`;
        params.push(location.city, location.state);
        paramCount += 2;
      }
    }
    
    query += ` ORDER BY r.name`;
    
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getById(id: number): Promise<Restaurant | null> {
    const result = await this.pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }

  async updateStatus(id: number, status: RestaurantStatus): Promise<Restaurant | null> {
    const result = await this.pool.query(
      'UPDATE restaurants SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    return result.rows[0] || null;
  }

  async update(id: number, data: Partial<Restaurant>): Promise<Restaurant | null> {
    const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at');
    
    if (fields.length === 0) return null;
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = fields.map(field => (data as any)[field]);
    values.push(id);
    
    const result = await this.pool.query(
      `UPDATE restaurants SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    
    return result.rows[0] || null;
  }

  async getRestaurantAnalytics(period: number = 30): Promise<any[]> {
    const query = `
      SELECT 
        r.id,
        r.name,
        COUNT(res.id) as total_reservations,
        SUM(res.party_size) as total_guests
      FROM restaurants r
      LEFT JOIN reservations res ON r.id = res.restaurant_id
      WHERE res.reservation_time > NOW() - INTERVAL '${period} days'
      GROUP BY r.id, r.name
      ORDER BY total_reservations DESC
    `;
    
    const result = await this.pool.query(query);
    return result.rows;
  }
} 