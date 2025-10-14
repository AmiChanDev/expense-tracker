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
import Login from "./Login";
import Register from "./Register";

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

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token)
  }

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  }

  //Checks Login
  if (!token) {
    return (
      <div>
        {showRegister ? (
          <>
            <Register onRegister={() => setShowRegister(false)} />
            <p>
              Already have an account?{" "}
              <button onClick={() => setShowRegister(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <p>
              Don't have an account?{" "}
              <button onClick={() => setShowRegister(true)}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/categories", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err))
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/transactions", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.log(err))
  }, [token])

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
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
        headers: { Authorization: `Bearer ${token}` }
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
