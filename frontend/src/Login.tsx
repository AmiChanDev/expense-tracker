import { useState } from "react";

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
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                {error && <div style={{ color: "red" }}>{error}</div>}
                <button type="submit">Login</button>
            </div>
        </form >
    )
}