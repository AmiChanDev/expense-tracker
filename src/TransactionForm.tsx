import { useState } from "react";

type TransactionFormProps = {
    onAdd: (description: string, amount: number) => void;
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description) return;
        if (Number(amount) === 0) return;
        if (amount === "-" || amount.trim() === "" || isNaN(Number(amount))) return;

        onAdd(description, Number(amount));
        setDescription("");
        setAmount("");
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Amount (- for expense)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}>
                </input>
                <br></br>
                <input
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></input>
                <br></br>
                <input type="submit"></input>
            </form>

        </div>
    );
}


