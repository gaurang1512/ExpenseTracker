import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from './Components/Header/Header';

function AppLayout({children}) {
  return (
    <>
      <Header></Header>
      <main className='content'>{children}</main>
    </>
  )
}

export default AppLayout
