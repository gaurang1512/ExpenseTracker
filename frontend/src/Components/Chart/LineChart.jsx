import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dateFormat } from '../../Utils/dateFormat';

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

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
      setIncomes(result.data || []); // Ensure result.data is an array
    } catch (err) {
      console.log('Error fetching incomes:', err);
    }
  };

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
      setExpenses(result.data || []); // Ensure result.data is an array
    } catch (err) {
      console.log('Error fetching expenses:', err);
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
  }, []);

  // Prepare data for the chart
  const data = {
    labels: incomes.map((inc) => {
      const { date } = inc;
      return dateFormat(date); // Format the date for the x-axis labels
    }),
    datasets: [
      {
        label: 'Income',
        data: incomes.map((income) => income.amount || 0), // Use 0 if amount is undefined
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        tension: 0.2,
      },
      {
        label: 'Expenses',
        data: expenses.map((expense) => expense.amount || 0), // Use 0 if amount is undefined
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="Line-chart-container">
      <Line data={data} />
    </div>
  );
}

export default LineChart;
