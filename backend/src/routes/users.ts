import { Router } from "express";
import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

//Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username or password required" });

  const hash = await bcrypt.hash(password, 10);
  try {
    await db.query("INSERT INTO users (username,password_hash) VALUES (?,?)", [
      username,
      hash,
    ]);
    res.status(201).json({ message: "User registered" });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Username already exists" });
    res.status(500).json({ error: "Registration failed" });
  }
});

//Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username or password required" });

  const [users] = await db.query<any[]>(
    "SELECT * FROM users where username=?",
    [username]
  );

  const user = users[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret is not configured" });
  }
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// Cleanup endpoint - Delete test users
router.delete("/cleanup", async (req, res) => {
  try {
    const pattern = req.query.pattern || "test_%";

    // First, delete all transactions for test users
    await db.execute(
      `DELETE t FROM transactions t 
       INNER JOIN users u ON t.user_id = u.id 
       WHERE u.username LIKE ?`,
      [pattern]
    );

    // Then delete the test users
    const [result] = await db.execute<any>(
      "DELETE FROM users WHERE username LIKE ?",
      [pattern]
    );

    res.json({
      message: "Cleanup completed",
      deletedUsers: result.affectedRows,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({ error: "Cleanup failed" });
  }
});

export default router;
