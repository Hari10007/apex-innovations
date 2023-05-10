import React from 'react'

import Header from '../../../components/admin_components/Header'
import Sidebar from '../../../components/employee_components/Sidebar'
import { Outlet } from 'react-router-dom'
import AlertMessage from '../../../components/alert/Alert'
import Loader from '../../../components/loader/Loader'

function EmployeesPage() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className='container'>
        <Loader />
        <AlertMessage />
        <Outlet/>
      </div>
    </>
  )
}

export default EmployeesPage
