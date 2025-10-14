import { Router } from "express";
import { db } from "../db.js";
import type { RowDataPacket, OkPacket } from "mysql2";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// GET all transactions
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM transactions WHERE user_id = ?",
      [userId]
    );
    res.json(rows);
    console.log("Transaction API GET method called for user", userId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// POST a new transaction
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { id, description, amount, category_id } = req.body;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    if (category_id === undefined || category_id === null) {
      return res.status(400).json({ error: "category_id is required" });
    }

    const [result] = await db.query<OkPacket>(
      "INSERT INTO transactions (id, user_id, description, amount, category_id) VALUES (?, ?, ?, ?, ?)",
      [id, userId, description, amount, Number(category_id)]
    );

    res.status(201).json({ message: "Transaction Inserted", id });
    console.log(`Transaction added with ID: ${id} for user ${userId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// DELETE a transaction
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query<OkPacket>(
      "DELETE FROM transactions WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Transaction not found" });

    res.json({ deletedId: id });
    console.log(`Transaction deleted with ID: ${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default router;
