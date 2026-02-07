import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const REQUIRED_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT',
  'NODE_ENV',
  'S3_BUCKET',
  'AWS_REGION',
];

/**
 * Loads and validates required environment variables
 * @param {string} key
 * @returns {string}
 */
export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value && REQUIRED_VARS.includes(key)) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value || '';
}
