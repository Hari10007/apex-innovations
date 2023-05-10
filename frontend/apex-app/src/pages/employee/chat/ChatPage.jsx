import React from 'react'
import Sidebar from '../../../components/employee_components/Sidebar'
import { Outlet } from 'react-router-dom'
import Header from '../../../components/admin_components/Header'
import "../../assets/css/Mobile.css"

function ChatPage() {
  return (
    <>
        <Sidebar />
        <Header />
        <div className='container'>  
            <Outlet />
        </div>
    </>
  )
}

export default ChatPage
