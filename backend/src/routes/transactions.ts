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
    console.log("Transaction API GET method called");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id, description, amount, categoryId } = req.body;

    const [result] = await db.query<OkPacket>(
      "INSERT INTO transactions (id,description, amount, category_id) VALUES (?,?,?,?)",
      [id, description, amount, categoryId]
    );

    res.status(201).json({ message: "Transaction Inserted", id });
    console.log(`Transaction added with ID:${id}`);
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
    console.log(`Transaction deleted with ID:${id}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export default router;
