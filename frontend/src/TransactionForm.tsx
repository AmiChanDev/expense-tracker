import { useState, useEffect } from "react";
import { TextField, Button, Grid, MenuItem, Box, Card, CardContent, Typography } from "@mui/material";

type TransactionFormProps = {
    onAdd: (id: number, description: string, amount: number, category: string) => void;
};

export default function TransactionForm({ onAdd }: TransactionFormProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryList, setCategoryList] = useState<{ id: number, name: string }[]>([]);
    const [category, setCategory] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/categories")
            .then((res) => res.json())
            .then((data) => {
                setCategoryList(data);
                console.log(data);
            })
            .catch((err) => console.error(err));
    }, []);

    const generatedId = (): number => Date.now() + Math.floor(Math.random() * 1000);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const numericAmount = Number(amount);
        if (!description || !category || isNaN(numericAmount) || numericAmount === 0) return;

        onAdd(generatedId(), description, numericAmount, category);

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
                            {categoryList.map((cat) => (
                                <MenuItem key={cat.id} value={cat.name}>
                                    {cat.name}
                                </MenuItem>
                            ))}
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
