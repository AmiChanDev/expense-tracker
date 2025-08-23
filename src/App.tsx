import { useState, type JSX } from "react";
import "./App.css";
import TransactionForm from "./TransactionForm";

type Transaction = {
  id: number;
  description: string;
  amount: number;
}

function App() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (description: string, amount: number) => {
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      description,
      amount
    }

    setTransactions([...transactions, newTransaction]);
  }

  return (
    <div className="app">
      <h1>Expense Tracker</h1>
      <TransactionForm onAdd={addTransaction} />

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.description}: {t.amount < 0 ? "-" : "+"}{Math.abs(t.amount)}LKR
          </li>
        ))

        }
      </ul>
    </div>
  );
}


export default App;