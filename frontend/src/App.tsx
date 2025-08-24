import { useEffect, useState } from "react";
import TransactionForm from "./TransactionForm";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  category_id: number;
};

type Category = {
  id: number;
  name: string;
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((total, t) => total + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((total, t) => total + t.amount, 0);

  const balance = income + expenses;

  const addTransaction = async (
    id: number,
    description: string,
    amount: number,
    category_id: number
  ) => {
    try {
      const res = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, description, amount, category_id }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error: Failed to add transaction");
        throw new Error("Failed to add transaction");
      }


      setTransactions((prev) => [
        ...prev,
        { id: data.id, description, amount, category_id },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/transactions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Error: Failed deleting a transaction");
        return;
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getCategoryName = (id: number) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "Unknown";
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 4, px: 2 }}>
      <Typography variant="h3" gutterBottom align="center">
        Expense Tracker
      </Typography>

      <TransactionForm onAdd={addTransaction} />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Transactions
          </Typography>
          <List>
            {transactions.map((t) => (
              <ListItem
                key={t.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteTransaction(t.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`[${t.id}] ${t.description}`}
                  secondary={`${t.amount < 0 ? "-" : "+"}${Math.abs(
                    t.amount
                  )} LKR (Category: ${getCategoryName(t.category_id)})`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Balance: {balance.toLocaleString()} LKR
          </Typography>
          <Grid container spacing={2}>
            <Grid>
              <Typography sx={{ color: "green" }}>
                Income: {income.toLocaleString()} LKR
              </Typography>
            </Grid>
            <Grid>
              <Typography sx={{ color: "red" }}>
                Expenses: {Math.abs(expenses).toLocaleString()} LKR
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
