import { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography, List, ListItem, ListItemText, IconButton, Box, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import DeleteIcon from "@mui/icons-material/Delete";
import Login from "./Login";
import Register from "./Register";
import TransactionForm from "./TransactionForm";

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

type JwtPayload = { userId: number; username: string; exp: number };

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (token: string) => {
    setToken(token);
    localStorage.setItem("token", token)
    window.location.reload();
  }

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    window.location.reload();
  }

  //Checks Login
  let username = "";
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      username = decoded.username;
    } catch {
      username = "";
    }
  }
  if (!token) {
    return (
      <div>
        {showRegister ? (
          <>
            <Register onRegister={() => setShowRegister(false)} />
            <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
              <Typography variant="body1">Already have an account?</Typography>
              <Button variant="outlined" onClick={() => setShowRegister(false)} sx={{ mt: 1 }}>
                Login
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
              <Typography variant="body1">Don't have an account?</Typography>
              <Button variant="outlined" onClick={() => setShowRegister(true)} sx={{ mt: 1 }}>
                Register
              </Button>
            </Box>
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

  const fetchTransactions = () => {
    if (!token) return;
    fetch("http://localhost:5000/transactions", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.log(err))
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((total, t) => total + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((total, t) => total + t.amount, 0);

  const balance = income + expenses;

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
      <Typography variant="h6">
        Logged in as <b>{username}</b>
      </Typography>
      <TransactionForm token={token} onTransactionAdded={fetchTransactions} />
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

      <Card>
        <Button onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </Box>
  );
}

export default App;
