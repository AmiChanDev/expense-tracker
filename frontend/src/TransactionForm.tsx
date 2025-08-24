import { useState, useEffect } from "react";
import { TextField, Button, Grid, MenuItem, Box, Card, CardContent, Typography } from "@mui/material";

type TransactionFormProps = {
    onAdd: (id: number, description: string, amount: number, category_id: number) => void;
};

export default function TransactionForm({ onAdd }: TransactionFormProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryList, setCategoryList] = useState<{ id: number, name: string }[]>([]);
    const [category_id, setCategory_id] = useState<number | null>(null);

    useEffect(() => {
        fetch("http://localhost:5000/categories")
            .then((res) => res.json())
            .then((data) => setCategoryList(data))
            .catch((err) => console.error(err));
    }, []);

    const generatedId = (): number => Date.now() + Math.floor(Math.random() * 1000);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const numericAmount = Number(amount);
        if (!description || category_id === null || isNaN(numericAmount) || numericAmount === 0) return;

        onAdd(generatedId(), description, numericAmount, category_id);

        setDescription("");
        setAmount("");
        setCategory_id(null);
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
                </Box>
            </CardContent>
        </Card>
    );
}
