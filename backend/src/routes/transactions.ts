import { Router } from "express";
import { db } from "../db.js";
import type { RowDataPacket, OkPacket } from "mysql2";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM transactions"
    );
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { description, amount, categoryId } = req.body;

    const [result] = await db.query<OkPacket>(
      "INSERT INTO transactions (description, amount, category) VALUES (?,?,?)",
      [description, amount, categoryId]
    );

    res
      .status(201)
      .json({ message: "Transaction Inserted", id: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query<OkPacket>(
      "DELETE FROM transactions WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Transaction not found" });

    res.json({ deletedId: id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export default router;
