import request from "supertest";
import express from "express";
import cors from "cors";
import transactionsRouter from "../routes/transactions.js";
import userRouter from "../routes/users.js";
import { db } from "../db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/transactions", transactionsRouter);
app.use("/users", userRouter);

describe("Transactions API", () => {
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    // Create a test user and get auth token
    await request(app).post("/users/register").send({
      username: "test_transaction_user",
      password: "password123",
    });

    const loginResponse = await request(app).post("/users/login").send({
      username: "test_transaction_user",
      password: "password123",
    });

    authToken = loginResponse.body.token;

    // Get user ID from database
    const [users] = await db.query<any[]>(
      "SELECT id FROM users WHERE username = ?",
      ["test_transaction_user"]
    );
    userId = users[0].id;
  });

  beforeEach(async () => {
    // Clean up transactions before each test
    await db.execute("DELETE FROM transactions WHERE user_id = ?", [userId]);
  });

  describe("GET /transactions", () => {
    it("should return empty array when no transactions exist", async () => {
      const response = await request(app)
        .get("/transactions")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return 401 without auth token", async () => {
      const response = await request(app).get("/transactions");

      expect(response.status).toBe(401);
    });

    it("should return user transactions only", async () => {
      // Add a transaction for our test user
      await db.execute(
        "INSERT INTO transactions (id, user_id, description, amount, category_id) VALUES (?, ?, ?, ?, ?)",
        [1001, userId, "Test Transaction", 100.5, 1]
      );

      const response = await request(app)
        .get("/transactions")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].description).toBe("Test Transaction");
      expect(response.body[0].amount).toBe(100.5);
    });
  });

  describe("POST /transactions", () => {
    it("should create a new transaction successfully", async () => {
      const transactionData = {
        id: 999,
        description: "New Test Transaction",
        amount: -50.25,
        category_id: 1,
      };

      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send(transactionData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Transaction Inserted");

      // Verify transaction was actually created
      const [transactions] = await db.query<any[]>(
        "SELECT * FROM transactions WHERE user_id = ? AND description = ?",
        [userId, "New Test Transaction"]
      );
      expect(transactions).toHaveLength(1);
      expect(transactions[0].amount).toBe(-50.25);
    });

    it("should return 400 for missing category_id", async () => {
      const response = await request(app)
        .post("/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          id: 999,
          description: "Invalid Transaction",
          amount: 100,
          // missing category_id
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("category_id is required");
    });

    it("should return 401 without auth token", async () => {
      const response = await request(app).post("/transactions").send({
        id: 999,
        description: "Unauthorized Transaction",
        amount: 100,
        category_id: 1,
      });

      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /transactions/:id", () => {
    let transactionId: number;

    beforeEach(async () => {
      // Create a transaction to delete
      const [result] = (await db.execute(
        "INSERT INTO transactions (id, user_id, description, amount, category_id) VALUES (?, ?, ?, ?, ?)",
        [2001, userId, "Transaction to Delete", 75.0, 1]
      )) as any;
      transactionId = 2001; // Use the ID we provided
    });

    it("should delete a transaction successfully", async () => {
      const response = await request(app)
        .delete(`/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.deletedId).toBe(transactionId.toString());

      // Verify transaction was deleted
      const [transactions] = await db.query<any[]>(
        "SELECT * FROM transactions WHERE id = ?",
        [transactionId]
      );
      expect(transactions).toHaveLength(0);
    });

    it("should return 404 for non-existent transaction", async () => {
      const response = await request(app)
        .delete("/transactions/99999")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Transaction not found");
    });
  });

  afterAll(async () => {
    // Clean up test data
    await db.execute("DELETE FROM transactions WHERE user_id = ?", [userId]);
    await db.execute("DELETE FROM users WHERE username = ?", [
      "test_transaction_user",
    ]);
  });
});
