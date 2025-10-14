import { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from "@mui/material";

type Props = {
    onLogin: (token: string) => void;
}

export default function Login({ onLogin }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:5000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Login Failed");
                return;
            }
            onLogin(data.token);

        } catch (error) {
            console.error(error)
            setError("Network Error");
        }
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Card sx={{ minWidth: 350, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
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
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                        >
                            Login
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}