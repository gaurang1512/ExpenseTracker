import React, { useState, useEffect } from 'react'
import { handleError, handleSucess } from '../../Utils/utils';
import { useNavigate } from 'react-router-dom';

function IncomeForm({ onAddIncome, editingIncome }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (editingIncome) {
            setTitle(editingIncome.title);
            setAmount(editingIncome.amount);
            setDescription(editingIncome.description);
            setDate(editingIncome.date.split('T')[0]); // Format date for input
            
        }
    }, [editingIncome]);

    const addIncome = async (e) => {
        e.preventDefault(); // Prevent page reload

        if (!title || !amount || !date || !description) {
            handleError("All fields are required!");
            return;
        }

        const newTransaction = {
            title,
            amount: Number(amount), // Convert to number
            date,
            description
        };

        try {
            const url = editingIncome 
                ? `http://localhost:8080/income/${editingIncome._id}`
                : "http://localhost:8080/income";

            const response = await fetch(url, {
                method: editingIncome ? "PUT" : "POST",
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTransaction),
            });

            if (response.status === 403) {
                navigate("/login");
                return;
            }

            const result = await response.json();
            console.log("Transaction saved:", result.data);
            
            // Clear form inputs
            setTitle("");
            setAmount("");
            setDescription("");
            setDate("");
            

            // Update parent component's state
            onAddIncome(result.data);
            handleSucess(editingIncome ? "Income updated successfully!" : "Income added successfully!");
        } catch (err) {
            handleError(err.message || (editingIncome ? "Error updating income" : "Error adding income"));
        }
    }

    return (
        
            <div className="income-form">
                <h1>{editingIncome ? "Update Income" : "Add Income"}</h1>
                <form onSubmit={addIncome}>
                    <div>
                        <label htmlFor="title">Income Title:</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter your Income Title..."
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
                    
                    <button type="submit">{editingIncome ? "Update Income" : "Add Income"}</button>
                </form>
            </div>
    );
}

export default IncomeForm;
