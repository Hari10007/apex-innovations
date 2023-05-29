import React from 'react'
import Header from '../../components/admin_components/Header'
import Sidebar from '../../components/employee_components/Sidebar'
import Dashboard from '../../components/admin_components/dashboard/Dashboard'


function AdminDashboardPage() {
  return (
    <>
      <Header/>
      <Sidebar />
      <div className='container'>
          <Dashboard/>
      </div>
    </>
  )
}

export default AdminDashboardPage
