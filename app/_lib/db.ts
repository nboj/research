import { Pool } from 'pg';

export const pool = new Pool({
    host: 'research-database.cluster-czapdtskkpgv.us-east-1.rds.amazonaws.com',
    port: 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    ssl: { rejectUnauthorized: false }, // required for RDS SSL
});
