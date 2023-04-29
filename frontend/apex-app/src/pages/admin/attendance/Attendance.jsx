import React from 'react'
import Sidebar from '../../../components/employee_components/Sidebar'
import Header from '../../../components/employee_components/Header'
import Loader from '../../../components/loader/Loader'
import AlertMessage from '../../../components/alert/Alert'
import { Outlet } from 'react-router-dom'

function AdminAttendancePage() {
  return (
    <>
      <Sidebar />
      <Header />
      <Loader />
      <div className='container'>
        <AlertMessage/>
        <Outlet />
      </div>

    </>
  )
}

export default AdminAttendancePage
