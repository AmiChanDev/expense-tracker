import request from "supertest";
import express from "express";
import cors from "cors";
import userRouter from "../routes/users.js";
import { db } from "../db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRouter);

describe("Authentication API", () => {
  beforeEach(async () => {
    // Clean up test users before each test
    await db.execute('DELETE FROM users WHERE username LIKE "test_%"');
  });

  describe("POST /users/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/users/register").send({
        username: "test_user_1",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered");
    });

    it("should return 400 for missing username", async () => {
      const response = await request(app).post("/users/register").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Username or password required");
    });

    it("should return 409 for duplicate username", async () => {
      // First registration
      await request(app).post("/users/register").send({
        username: "test_duplicate",
        password: "password123",
      });

      // Second registration with same username
      const response = await request(app).post("/users/register").send({
        username: "test_duplicate",
        password: "password456",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Username already exists");
    });
  });

  describe("POST /users/login", () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app).post("/users/register").send({
        username: "test_login_user",
        password: "password123",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/users/login").send({
        username: "test_login_user",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe("string");
    });

    it("should return 401 for invalid username", async () => {
      const response = await request(app).post("/users/login").send({
        username: "nonexistent_user",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid credentials");
    });

    it("should return 401 for invalid password", async () => {
      const response = await request(app).post("/users/login").send({
        username: "test_login_user",
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid credentials");
    });
  });
});
