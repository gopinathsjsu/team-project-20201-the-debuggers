import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_PASSWORD) {
  console.error('Database password is not set in environment variables');
  process.exit(1);
}

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  ssl: false
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection error:', (err as Error).message);
  }
};

testConnection();

export default pool; 