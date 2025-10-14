import { useState, useEffect } from "react";
import { TextField, Button, Grid, MenuItem, Box, Card, CardContent, Typography } from "@mui/material";

type TransactionFormProps = {
    token: string;
    onTransactionAdded: () => void;
};


export default function TransactionForm({ token, onTransactionAdded }: TransactionFormProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryList, setCategoryList] = useState<{ id: number, name: string }[]>([]);
    const [category_id, setCategory_id] = useState<number | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => setCategoryList(Array.isArray(data) ? data : []))
            .catch((err) => {
                setCategoryList([]);
                console.error(err);
            });
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const numericAmount = Number(amount);
        if (!description || category_id === null || isNaN(numericAmount) || numericAmount === 0) return;

        try {
            const res = await fetch("http://localhost:5000/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    description,
                    amount: numericAmount,
                    category_id
                })
            });
            if (!res.ok) {
                setError("Failed to add transaction");
                return;
            }
            setDescription("");
            setAmount("");
            setCategory_id(null);
            onTransactionAdded();
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Add Transaction</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid>
                            <TextField
                                fullWidth
                                label="Amount (- for expense)"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                fullWidth
                                label="Description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>

                        <TextField
                            select
                            fullWidth
                            label="Category"
                            value={category_id ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                setCategory_id(val === "" ? null : Number(val));
                            }}
                        >
                            {categoryList.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Grid>
                            <Button variant="contained" color="success" type="submit" fullWidth>
                                Add Transaction
                            </Button>
                        </Grid>
                    </Grid>
                    {error && <Typography color="error">{error}</Typography>}
                </Box>
            </CardContent>
        </Card>
    );
}
