import React, { useState } from 'react'
import IncomeHistory from '../Components/History/IncomeHistory'
import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import ExpenseHistory from '../Components/History/ExpenseHistory'
import RefreshHandler from '../RefreshHandler'
import { calender, money } from '../Utils/Icons'
import SearchBar from '../Components/SearchBar/SearchBar'

function History() {
  //Private Routing
  const[isAuthenticated , setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const PrivateRoute = ({element})=>{
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  const handleSearch = (term) => {
    setSearchTerm(term);
  }

  return (
    <div className='history-page'>
      <div className="history-container">
        <div className="history-header">
          <h1>Transaction History</h1>
          <p>View your income and expense history</p>
        </div>
        <div>
          <SearchBar onSearch={handleSearch} placeholder="Search transactions..." />
          
        </div>
        

        <nav className="history-nav">
          <NavLink 
            to="/navigation/history/income" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">{money}</span>
            Income History
          </NavLink>

          <NavLink 
            to="/navigation/history/expense" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">{calender}</span>
            Expense History
          </NavLink>
        </nav>
        
        <div className="history-content">
          <RefreshHandler setIsAuthenticated={setIsAuthenticated}/>
          <Routes>
            <Route path='/income/*' element={<IncomeHistory searchTerm={searchTerm} />} />
            <Route path='expense/*' element={<ExpenseHistory searchTerm={searchTerm} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default History
