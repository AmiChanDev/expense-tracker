import { useState } from "react";

type TransactionFormProps = {
    onAdd: (description: string, amount: number) => void;
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || Number(amount) === 0 || amount === "") return;

        onAdd(description, Number(amount));
        setDescription("");
        setAmount("");
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Amount (Enter negative for expense)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}>
                </input>

                <input
                    type="text"
                    placeholder="Enter income/expense description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></input>

                <input type="submit"></input>
            </form>

        </div>
    );
}


