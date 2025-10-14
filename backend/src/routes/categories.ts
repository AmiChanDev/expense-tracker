import { Router } from "express";
import { db } from "../db.js";
import type { RowDataPacket } from "mysql2";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [categoryRows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM category"
    );
    res.json(categoryRows);
    console.log("Category API GET method called");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export default router;
