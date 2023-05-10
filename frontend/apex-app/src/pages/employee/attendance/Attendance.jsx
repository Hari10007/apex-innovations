import React from 'react'
import Header from '../../../components/employee_components/Header'
import Sidebar from '../../../components/employee_components/Sidebar'
import "react-datepicker/dist/react-datepicker.css";
import Loader from '../../../components/loader/Loader';
import AlertMessage from '../../../components/alert/Alert';
import { Outlet } from 'react-router-dom';
// import "../../assets/css/Mobile.css"

function AttendancePage() {

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

export default AttendancePage
