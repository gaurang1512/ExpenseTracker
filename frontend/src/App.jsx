import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import Navigation from './Components/Navigation';
import Header from './Components/Header/Header';
import AppLayout from './AppLayout';

function App() {
/*
//One More method for routing is 
const router = createBrowserRouter([
{
optional
path : '/path',
element: <ParentElement>
errroElement:<ErrorPage>    //Can create error page and pass it here
childern:[
{
path:'/',
element:<Home/>
},
secand element... ]
}])
*/


  return (
    <div className='App'>
      
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/navigation/*' element={
          <AppLayout>
            <Navigation/>
          </AppLayout>
          }></Route>
        
      </Routes>
  
    </div>
  )
}

export default App
