import React from 'react'
// import ManagerSidebar from '../../components/manager_components/ManagerSidebar'
// import Header from '../../components/manager_components/Header'
import AlertMessage from '../../components/alert/Alert'
import Loader from '../../components/loader/Loader'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/employee_components/Sidebar'
import Header from '../../components/employee_components/Header'

function LeaveManagementPage() {
  return (
    <>
        <Loader />
        <Sidebar />
        <Header />
        <div className='container'>
            <AlertMessage />
            <Outlet />
        </div>
    </>
  )
}

export default LeaveManagementPage
