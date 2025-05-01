import React, { useEffect, useState } from 'react'
import IncomeItem from '../Pages/IncomeItem/IncomeItem';
import { handleError, handleSucess } from '../Utils/utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import IncomeForm from '../Components/IncomeForm/IncomeForm';
import IncomeBarChart from '../Components/Chart/IncomeBarChart';
import SearchBar from '../Components/SearchBar/SearchBar';

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedIncomes, setSortedIncomes] = useState(incomes); // Local state for sorting

  const navigate = useNavigate();
  /*useEffect(() => {
    console.log("Incomes State Updated:", incomes);
}, [incomes]);*/

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Update filtered incomes when incomes change
  useEffect(() => {
    setFilteredIncomes(incomes);
  }, [incomes]);

  //Fetch all Income details
  const fetchIncomes = async () => {
    try {
      //const user = localStorage.getItem('id')
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
      setIncomes(result.data || []); // Ensure result.data is an array
    } catch (err) {
      handleError('Error fetching income');
    }
  }

  const handleDeleteIncome = async (incomeId) => {
    try {
      const url = `http://localhost:8080/income/${incomeId}`;
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
      setIncomes(prevIncomes => prevIncomes.filter(income => income._id !== incomeId));
      handleSucess(result.message);
    } catch (err) {
      handleError(err);
    }
  }

  const handleUpdateIncome = (incomeId) => {
    const income = incomes.find(income => income._id === incomeId);
    setEditingIncome(income);
  }

  const handleAddIncome = (newIncome) => {
    if (editingIncome) {
      // Update existing income
      setIncomes(prevIncomes => 
        prevIncomes.map(income => 
          income._id === editingIncome._id ? newIncome : income
        )
      );
      setEditingIncome(null);
    } else {
      // Add new income
      setIncomes(prevIncomes => [newIncome, ...prevIncomes]);
    }
  }

  //Expense Details Section
  const [incomeAmt, setIncomeAmt] = useState(0);

  useEffect(() => {
    const amounts = incomes.map((item) => (item?.amount || 0));
    console.log("Amount =", amounts);

    const income = amounts.filter(item => item > 0)
      .reduce((acc, item) => (acc += item), 0);
    console.log("Income:", income);

    setIncomeAmt(income);
  }, [incomes]);

  // Handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredIncomes(incomes);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = incomes.filter(income => 
      income.title.toLowerCase().includes(searchLower) || 
      income.description.toLowerCase().includes(searchLower) ||
      income.amount.toString().includes(searchTerm)
    );
    
    setFilteredIncomes(filtered);
  };

  // Handle search input change
    const handleSearchChange = (e) => {
      const term = e.target.value;
      setSearchTerm(term);
      onSearch(term); // Call the search function passed from Income.jsx
    };
  
    // Handle sorting
    const handleSort = (field, order) => {
      const sorted = [...incomes].sort((a, b) => {
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
  
    // Update sorted incomes whenever the incomes prop changes
    useEffect(() => {
      setSortedIncomes(incomes);
    }, [incomes]);

  return (
    <div className='income-section'>
      <div className='head-page-container'>
        
        <SearchBar onSearch={handleSearch} searchTerm={searchTerm} placeholder="Search income..." />
        
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
        
        <div className='total-income sticky'>
          <h2>Total Income: <span>${incomeAmt}</span></h2>
        </div>
      </div>
      
      <div className="form-container">
        <IncomeForm 
          onAddIncome={handleAddIncome}
          editingIncome={editingIncome}
        ></IncomeForm>
        <IncomeBarChart></IncomeBarChart>
      </div>
      <div className="incomes">
        <IncomeItem 
          incomes={filteredIncomes} 
          sortedIncomes={sortedIncomes}
          onSearch={handleSearch} 
          handleDeleteIncome={handleDeleteIncome} 
          handleUpdateIncome={handleUpdateIncome} 
        />
      </div>

      <ToastContainer></ToastContainer>
    </div>
  )
}

export default Income
