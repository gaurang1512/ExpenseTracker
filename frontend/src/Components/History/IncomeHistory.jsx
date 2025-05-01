import React, { useEffect, useState } from 'react';
import { dateFormat } from '../../Utils/dateFormat';
import { handleError } from '../../Utils/utils';
import { useNavigate } from 'react-router-dom';

function IncomeHistory({ searchTerm = '' }) {
  const [incomes, setIncomes] = useState([]);
  const [sortedIncomes, setSortedIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', order: 'ASC' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Update filtered incomes when sortedIncomes or searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredIncomes(sortedIncomes);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = sortedIncomes.filter((income) =>
      income.title.toLowerCase().includes(searchLower) ||
      income.description.toLowerCase().includes(searchLower) ||
      income.amount.toString().includes(searchTerm)
    );

    setFilteredIncomes(filtered);
  }, [sortedIncomes, searchTerm]);

  // Fetch all Income details
  const fetchIncomes = async () => {
    try {
      const url = 'http://localhost:8080/income';
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
      setIncomes(result.data);
    } catch (err) {
      handleError('Error fetching incomes');
    }
  };

  // Handle sorting
  const handleSort = (col) => {
    const newOrder = sortConfig.key === col && sortConfig.order === 'ASC' ? 'DESC' : 'ASC';
    setSortConfig({ key: col, order: newOrder });

    const sorted = [...incomes].sort((a, b) => {
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

    setSortedIncomes(sorted);
  };

  // Update sorted incomes whenever the incomes prop changes
  useEffect(() => {
    setSortedIncomes(incomes);
  }, [incomes]);

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
          {Array.isArray(filteredIncomes) &&
            filteredIncomes.map((income, index) => (
              <tr key={index}>
                <td>{income.title}</td>
                <td>{income.description}</td>
                <td>{dateFormat(income.date)}</td>
                <td>${income.amount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncomeHistory;
