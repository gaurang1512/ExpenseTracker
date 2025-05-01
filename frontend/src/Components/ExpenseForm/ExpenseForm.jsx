import React, { useState, useEffect } from "react";
import { handleError, handleSucess } from "../../Utils/utils";
import { useNavigate } from 'react-router-dom';

function ExpenseForm({ onAddExpense, editingExpense }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (editingExpense) {
            setTitle(editingExpense.title);
            setAmount(editingExpense.amount);
            setDescription(editingExpense.description);
            setDate(editingExpense.date.split('T')[0]);
        }
    }, [editingExpense]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !amount || !date || !description) {
            handleError("All fields are required!");
            return;
        }

        const transaction = {
            title,
            amount: Number(amount),
            date,
            description,
        };

        try {
            const url = editingExpense 
                ? `http://localhost:8080/expense/${editingExpense._id}`
                : 'http://localhost:8080/expense';

            const method = editingExpense ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transaction),
            });

            if (response.status === 403) {
                navigate("/login");
                return;
            }

            const result = await response.json();
            
            // Clear form inputs
            setTitle("");
            setAmount("");
            setDescription("");
            setDate("");

            // Update parent component's state
            onAddExpense(result.data);
            handleSucess(editingExpense ? "Expense updated successfully!" : "Expense added successfully!");
        } catch (err) {
            handleError(err.message || (editingExpense ? "Error updating expense" : "Error adding expense"));
        }
    };

    return (
       
            <div className="income-form">
                <h1>{editingExpense ? 'Update Expense' : 'Add Expense'}</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Expense Title:</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter your Expense Title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="amount">Amount:</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter the amount..."
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            name="date"
                            placeholder="Enter the date..."
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Enter the description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit">{editingExpense ? 'Update Expense' : 'Add Expense'}</button>
                </form>
            </div>
    );
}

export default ExpenseForm;
