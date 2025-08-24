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
  category: string;
};

type Category = {
  id: number;
  name: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);


  // Calculate totals
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((total, t) => total + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((total, t) => total + t.amount, 0);

  const balance = income + expenses;

  // Add a new transaction
  const addTransaction = (id: number, description: string, amount: number, category: string) => {
    const newTransaction: Transaction = {
      id,
      description,
      amount,
      category,
    };
    setTransactions([...transactions, newTransaction]);
  };

  // Delete a transaction
  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 4, px: 2 }}>
      <Typography variant="h3" gutterBottom align="center">
        Expense Tracker
      </Typography>

      {/* Transaction Form */}
      <TransactionForm onAdd={addTransaction} />

      {/* Transaction List */}
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
                  primary={`[${t.category}] ${t.description}`}
                  secondary={`${t.amount < 0 ? "-" : "+"}${Math.abs(t.amount)} LKR`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Balance Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Balance: {balance.toLocaleString()} LKR
          </Typography>
          <Grid container spacing={2}>
            <Grid sx={{ flex: 1 }}>
              <Typography sx={{ color: "green" }}>Income: {income.toLocaleString()} LKR</Typography>
            </Grid>
            <Grid sx={{ flex: 1 }}>
              <Typography sx={{ color: "red" }}>Expenses: {Math.abs(expenses).toLocaleString()} LKR</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
