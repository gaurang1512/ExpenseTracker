import React, { useEffect, useState } from 'react'
import { handleError, handleSucess } from '../Utils/utils';
import ExpenseItem from './ExpenseItem/ExpenseItem';
import { useNavigate } from 'react-router-dom';
import ExpenseFrom from '../Components/ExpenseForm/ExpenseForm'
import { ToastContainer } from 'react-toastify';
import ExpenseBarChart from '../Components/Chart/ExpenseBarChart';
import SearchBar from '../Components/SearchBar/SearchBar';

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedIncomes, setSortedIncomes] = useState(expenses); // Local state for sorting

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Update filtered expenses when expenses change
  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

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

  const handleUpdateExpense = (expenseId) => {
    const expense = expenses.find(expense => expense._id === expenseId);
    setEditingExpense(expense);
  }

  const handleDeleteExpense = async (expenseId) => {
    try {
      const url = `http://localhost:8080/expense/${expenseId}`;
      const headers = {
        headers: {
          "Authorization": localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        method: 'DELETE',
      }
      const response = await fetch(url, headers);
      if (response.status === 403) {
        navigate('/login');
        return;
      }
      const result = await response.json();
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense._id !== expenseId));
      handleSucess(result.message);
    } catch (err) {
      handleError(err.message || "Error deleting expense");
    }
  }

  const handleAddExpense = (newExpense) => {
    if (editingExpense) {
      // Update existing expense
      setExpenses(prevExpenses => 
        prevExpenses.map(expense => 
          expense._id === editingExpense._id ? newExpense : expense
        )
      );
      setEditingExpense(null); // Clear editing state
    } else {
      // Add new expense
      setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    }
  }

  //Expense Details Section
  const [expenseAmt, setExpenseAmt] = useState(0);

  useEffect(() => {
    const amounts = expenses.map((item) => item.amount);
    console.log("Amount =", amounts);

    const expense = amounts.filter(item => item > 0)
      .reduce((acc, item) => (acc += item), 0);
    console.log("Expense:", expense);

    setExpenseAmt(expense);
  }, [expenses]);

  // Handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredExpenses(expenses);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = expenses.filter(expense => 
      expense.title.toLowerCase().includes(searchLower) || 
      expense.description.toLowerCase().includes(searchLower) ||
      expense.amount.toString().includes(searchTerm)
    );
    
    setFilteredExpenses(filtered);
  };

  // Handle search input change
      const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term); // Call the search function passed from Income.jsx
      };
      
      // Handle sorting
      const handleSort = (field, order) => {
        const sorted = [...expenses].sort((a, b) => {
          if (field === 'amount') {
            return order === 'ascending' ? a.amount - b.amount : b.amount - a.amount;
          }
          if (field === 'date') {
            return order === 'ascending'
              ? new Date(a.date) - new Date(b.date)
              : new Date(b.date) - new Date(a.date);
          }
          return 0;
        });
        setSortedIncomes(sorted);
      };
    
      // Update sorted expenses whenever the incomes prop changes
      useEffect(() => {
        setSortedIncomes(expenses);
      }, [expenses]);


  return (
    <>
      <div className='expense-section'>
        <div className='head-page-container'>
          <SearchBar onSearch={handleSearch} placeholder="Search expenses..." />
          <div className='sort-container'>
            <div >
              <label htmlFor="sort-amount">Sort by Amount:</label><br />
              <select
                name="sort-amount"
                id="sort-amount"
                onChange={(e) => {
                  const order = e.target.value;
                  handleSort('amount', order);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  backgroundColor: '#f8f9fa',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#333',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  minWidth: '120px'
                }}
                onMouseOver={(e) => e.target.style.borderColor = '#36A2EB'}
                onMouseOut={(e) => e.target.style.borderColor = '#ccc'}
                onFocus={(e) => e.target.style.borderColor = '#36A2EB'}
                onBlur={(e) => e.target.style.borderColor = '#ccc'}
              >
                <option value="">Select</option>
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>

            <div>
              <label htmlFor="sort-date">Sort by Date:</label><br />
              <select
                name="sort-date"
                id="sort-date"
                onChange={(e) => {
                  const order = e.target.value;
                  handleSort('date', order);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  backgroundColor: '#f8f9fa',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#333',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  minWidth: '120px'
                }}
                onMouseOver={(e) => e.target.style.borderColor = '#36A2EB'}
                onMouseOut={(e) => e.target.style.borderColor = '#ccc'}
                onFocus={(e) => e.target.style.borderColor = '#36A2EB'}
                onBlur={(e) => e.target.style.borderColor = '#ccc'}
              >
                <option value="">Select</option>
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>
          </div>
          <div className='total-expense sticky'>
            <h2>Total Expense: <span>${expenseAmt}</span></h2>
          </div>
        </div>
        
        <div className="form-container">
          <ExpenseFrom 
            onAddExpense={handleAddExpense}
            editingExpense={editingExpense}
          ></ExpenseFrom>
          
            <ExpenseBarChart />
          
        </div>

        <div className="expenses">
          <ExpenseItem 
            sortedIncomes={sortedIncomes}
            expenses={filteredExpenses}
            handleDeleteExpense={handleDeleteExpense}
            handleUpdateExpense={handleUpdateExpense}
          />
        </div>

        <ToastContainer />
      </div>
    </>
    
  )
}

export default Expense
