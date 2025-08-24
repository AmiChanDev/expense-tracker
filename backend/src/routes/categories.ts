import { Router } from "express";
import { db } from "../db.js";
import type { RowDataPacket } from "mysql2";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [categoryRows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM category"
    );
    res.json(categoryRows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export default router;
