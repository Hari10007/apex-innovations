import React from 'react'
import Header from '../../../components/admin_components/Header'
import Sidebar from '../../../components/employee_components/Sidebar'
import AlertMessage from '../../../components/alert/Alert'
import { Outlet } from 'react-router-dom'

function EmployeeSalary() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className='container'>
        <AlertMessage/>
        <Outlet />
      </div>
    </>
  )
}

export default EmployeeSalary
