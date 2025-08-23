import { useState } from "react";
import { TextField, Button, Grid, MenuItem, Box, Card, CardContent, Typography } from "@mui/material";

type TransactionFormProps = {
    onAdd: (description: string, amount: number, category: string) => void;
};

export default function TransactionForm({ onAdd }: TransactionFormProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const numericAmount = Number(amount);
        if (!description || !category || isNaN(numericAmount) || numericAmount === 0) return;

        onAdd(description, numericAmount, category);
        setDescription("");
        setAmount("");
        setCategory("");
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Add Transaction
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <TextField
                            fullWidth
                            label="Amount (- for expense)"
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="Food">Food</MenuItem>
                            <MenuItem value="Travel">Travel</MenuItem>
                            <MenuItem value="Salary">Salary</MenuItem>
                            <MenuItem value="Shopping">Shopping</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        <Button variant="contained" color="success" type="submit" fullWidth>
                            Add Transaction
                        </Button>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
}
