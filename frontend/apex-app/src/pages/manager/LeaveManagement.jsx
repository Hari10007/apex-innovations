import React from 'react'
import ManagerSidebar from '../../components/manager_components/ManagerSidebar'
import Header from '../../components/manager_components/Header'
import AlertMessage from '../../components/alert/Alert'
import Loader from '../../components/loader/Loader'
import { Outlet } from 'react-router-dom'

function LeaveManagementPage() {
  return (
    <>
        <Loader />
        <ManagerSidebar />
        <Header />
        <div className='container'>
            <AlertMessage />
            <Outlet />
        </div>
    </>
  )
}

export default LeaveManagementPage
