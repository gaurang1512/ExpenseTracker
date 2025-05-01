import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { handleError } from '../../Utils/utils';
import { useNavigate } from 'react-router-dom';

Chart.register(...registerables);

function IncomeBarChart() {
  const [incomes, setIncomes] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Update chart when incomes or selectedYear changes
  useEffect(() => {
    if (incomes.length > 0) {
      updateChart();
    }
  }, [incomes, selectedYear]);

  const fetchIncomes = async () => {
    try {
      const url = "http://localhost:8080/income";
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
      setIncomes(result.data);
    } catch (err) {
      handleError('Error fetching income data');
    }
  }

  // Get available years from income data
  const getAvailableYears = () => {
    const years = new Set();
    incomes.forEach(income => {
      const year = new Date(income.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a); // Sort in descending order
  };

  // Process data for monthly view of selected year
  const processMonthlyData = () => {
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with zero values
    months.forEach(month => {
      monthlyData[month] = 0;
    });

    // Sum up income amounts by month for the selected year
    incomes.forEach(income => {
      const incomeDate = new Date(income.date);
      const incomeYear = incomeDate.getFullYear();
      const incomeMonth = incomeDate.getMonth(); // 0-11
      
      if (incomeYear === selectedYear) {
        const monthName = months[incomeMonth];
        monthlyData[monthName] += income.amount;
      }
    });

    return {
      labels: months,
      data: months.map(month => monthlyData[month])
    };
  };

  // Update chart data and options
  const updateChart = () => {
    const { labels, data } = processMonthlyData();
    const availableYears = getAvailableYears();
    
    // Update chart data
    setChartData({
      labels: labels,
      datasets: [{
        label: `Monthly Income for ${selectedYear}`,
        data: data,
        backgroundColor: '#36A2EB',
        borderColor: '#2693e6',
        borderWidth: 1
      }]
    });
    
    // Update chart options
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Monthly Income Distribution for ${selectedYear}`
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount'
          }
        }
      }
    });
  };

  const availableYears = getAvailableYears();

  return (
    <div className="chart-container">
      <div className="year-selector" style={{
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <label 
          htmlFor="year-select" 
          style={{
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#333'
          }}
        >
          Select Year: 
        </label>
        <select 
          id="year-select" 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))}
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
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      {chartData && chartOptions && <Bar data={chartData} options={chartOptions} />}
    </div>
  )
}

export default IncomeBarChart