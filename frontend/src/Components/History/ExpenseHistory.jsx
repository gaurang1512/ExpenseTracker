import React, { useEffect, useState } from 'react';
import { dateFormat } from '../../Utils/dateFormat';
import { handleError } from '../../Utils/utils';
import { useNavigate } from 'react-router-dom';

function ExpenseHistory({ searchTerm = '' }) {
  const [expenses, setExpenses] = useState([]);
  const [sortedExpenses, setSortedExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', order: 'ASC' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Update filtered expenses when sortedExpenses or searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredExpenses(sortedExpenses);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = sortedExpenses.filter((expense) =>
      expense.title.toLowerCase().includes(searchLower) ||
      expense.description.toLowerCase().includes(searchLower) ||
      expense.amount.toString().includes(searchTerm)
    );

    setFilteredExpenses(filtered);
  }, [sortedExpenses, searchTerm]);

  // Fetch all Expense details
  const fetchExpenses = async () => {
    try {
      const url = 'http://localhost:8080/expense';
      const headers = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        method: 'GET',
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        navigate('/login');
        return;
      }
      const result = await response.json();
      setExpenses(result.data);
    } catch (err) {
      handleError('Error fetching expenses');
    }
  };

  // Handle sorting
  const handleSort = (col) => {
    const newOrder = sortConfig.key === col && sortConfig.order === 'ASC' ? 'DESC' : 'ASC';
    setSortConfig({ key: col, order: newOrder });

    const sorted = [...expenses].sort((a, b) => {
      if (col === 'amount') {
        return newOrder === 'ASC' ? a[col] - b[col] : b[col] - a[col];
      }
      if (col === 'date') {
        return newOrder === 'ASC'
          ? new Date(a[col]) - new Date(b[col])
          : new Date(b[col]) - new Date(a[col]);
      }
      return newOrder === 'ASC'
        ? a[col].toString().localeCompare(b[col].toString())
        : b[col].toString().localeCompare(a[col].toString());
    });

    setSortedExpenses(sorted);
  };

  // Update sorted expenses whenever the expenses prop changes
  useEffect(() => {
    setSortedExpenses(expenses);
  }, [expenses]);

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('title')}>Title</th>
            <th onClick={() => handleSort('description')}>Description</th>
            <th onClick={() => handleSort('date')}>Date</th>
            <th onClick={() => handleSort('amount')}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredExpenses) &&
            filteredExpenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.title}</td>
                <td>{expense.description}</td>
                <td>{dateFormat(expense.date)}</td>
                <td>${expense.amount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseHistory;
