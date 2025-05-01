import React, { useEffect, useState } from 'react'
import { handleError } from '../../Utils/utils';
import { useNavigate } from 'react-router-dom';
import { money ,Expensess, Balance } from '../../Utils/Icons';

function ExpenseDetails() {
    const navigate = useNavigate();
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);

    const fetchIncomes = async () => {
        try {
            const url = `http://localhost:8080/income`;
            const headers = {
                headers: {
                    "Authorization": localStorage.getItem('token')
                },
                method: 'GET'
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                navigate('/login');
                return;
            }
            const result = await response.json();
            console.log("Fetched income", result);
            setIncomes(result.data);
        } catch (err) {
            handleError('Error fetching income');
        }
    }

    const fetchExpenses = async () => {
        try {
            const url = "http://localhost:8080/expense";
            const headers = {
                headers: {
                    "Authorization": localStorage.getItem('token')
                },
                method: 'GET'
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                navigate('/login');
                return;
            }
            const result = await response.json();
            console.log("Fetched expenses", result);
            setExpenses(result.data);
        } catch (err) {
            handleError('Error fetching expenses');
        }
    }

    useEffect(() => {
        fetchExpenses();
        fetchIncomes();
    }, []);

    useEffect(() => {
        const incomeAmounts = incomes.map((item) => item.amount);
        const totalIncome = incomeAmounts
            .filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);
        setIncomeAmt(totalIncome);
    }, [incomes]);

    useEffect(() => {
        const expenseAmounts = expenses.map((item) => item.amount);
        const totalExpense = expenseAmounts
            .filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);
        setExpenseAmt(totalExpense);
    }, [expenses]);

    return (
<div className="display-amt">
    <p className='card card-p'>Your Account Information</p>
    <div className="card">
        <div >
            <p className="data">
                    {incomeAmt}
            </p>

            <p className="title-text">
                Total Income
             </p>
        </div>
        <span>
            {money}
        </span>
    </div>
    <div className="card">
        <div >
            <p className="data">
                {expenseAmt}
            </p>
                
            <p className="title-text">
                Total Expenses
            </p>
        </div>
            
        <span>
            {Expensess}
        </span>
    </div>            
        <div className="card">
            <div >
                <p className="data">{incomeAmt - expenseAmt}</p>

                <p className="title-text">
                    Total Balance
                </p>
            </div>
                
            <span>
                {Balance}    
            </span>
            </div>
            
        </div>
    );
}

export default ExpenseDetails;
