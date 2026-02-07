import { Pool } from 'pg';
import { getEnv } from './env';

/**
 * PostgreSQL connection pool instance
 * Uses environment variable DATABASE_URL for connection string
 */
export const pool = new Pool({
  connectionString: getEnv('DATABASE_URL'),
  ssl: getEnv('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

/**
 * Get a client from the pool
 * @returns {Promise<import('pg').PoolClient>}
 */
export async function getDbClient() {
  try {
    const client = await pool.connect();
    return client;
  } catch (err) {
    console.error('Failed to acquire a database client', err);
    throw err;
  }
}
