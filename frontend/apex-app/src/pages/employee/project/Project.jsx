import React from 'react'
import Header from '../../../components/employee_components/Header'
import Sidebar from '../../../components/employee_components/Sidebar'
import Loader from '../../../components/loader/Loader'
import AlertMessage from '../../../components/alert/Alert'
import { Outlet } from 'react-router-dom'


function ProjectPage() {

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

export default ProjectPage
