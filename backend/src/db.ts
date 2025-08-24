import mysql, { type Pool } from "mysql2/promise";

export const db: Pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "expense-tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("connected to database - {expense-tracker}");
