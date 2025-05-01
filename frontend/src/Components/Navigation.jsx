import React, { useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSucess } from '../utils';
import RefreshHandler from '../RefreshHandler';
import Home from '../Pages/Home';
import Income from '../Pages/Income';
import Expense from '../Pages/Expense';
import History from '../Pages/History';
import { dashboard, history, money, expenses, signout } from '../Utils/Icons';
import Header from './Header/Header';

function Navigation() {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //Private Routing
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }
  return (
    <div className='whole-container'>
      <div className='Page-container'>
        
        <div className={`Home-container`}> 
          <ul className='menu-items'>
            <li>
              <NavLink to="/navigation/home">
                {dashboard} Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/navigation/history">
                {history} History
              </NavLink>
            </li>
            <li>
              <NavLink to="/navigation/income">
                {money} Income
              </NavLink>
            </li>
            <li>
              <NavLink to="/navigation/expense">
                {expenses} Expense
              </NavLink>
            </li>
          </ul>
          
          <ToastContainer />
        </div>
        
        <div className="main-container">
          <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
          <Routes>
            <Route path='home/*' element={<PrivateRoute element={<Home />} />} />
            <Route path='history/*' element={<History />} />
            <Route path='income/*' element={<Income />} />
            <Route path='expense/*' element={<Expense />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Navigation
