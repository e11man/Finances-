import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const globalForPool = globalThis;

let pool;

if (!globalForPool.pgPool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3, // keep small for serverless
  });
  globalForPool.pgPool = pool;
} else {
  pool = globalForPool.pgPool;
}

export const query = (text, params) => pool.query(text, params);