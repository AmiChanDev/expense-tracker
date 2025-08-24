import mysql, { type Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DB_HOST = process.env.DB_HOST!;
const DB_USER = process.env.DB_USER!;
const DB_PASSWORD = process.env.DB_PASSWORD!;
const DB_NAME = process.env.DB_NAME!;
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;

export const db: Pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: DB_PORT,
});

console.log(`Connected to database - ${DB_NAME}`);
