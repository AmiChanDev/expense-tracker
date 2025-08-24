import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import transactionsRouter from "./routes/transactions.js";
import categoryRouter from "./routes/categories.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/transactions", transactionsRouter);
app.use("/categories", categoryRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
