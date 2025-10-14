import { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from "@mui/material";

type Props = {
    onRegister: () => void;
};

export default function Register({ onRegister }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const res = await fetch("http://localhost:5000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Registration failed");
                return;
            }
            setSuccess("Registration successful! You can now log in.");
            if (onRegister) onRegister();
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Card sx={{ minWidth: 350, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Register
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            autoFocus
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                        />
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                        >
                            Register
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}