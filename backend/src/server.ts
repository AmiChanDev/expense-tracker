import express from "express";
import cors from "cors";
import transactionsRouter from "./routes/transactions.js";
import categoryRouter from "./routes/categories.js";
import userRouter from "./routes/users.js";

const app = express();

app.set("strict routing", false);

app.use(cors());
app.use(express.json());

// Routes
app.use("/transactions", transactionsRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
