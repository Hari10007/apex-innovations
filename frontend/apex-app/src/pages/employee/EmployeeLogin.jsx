import React from 'react'
import '../assets/css/Login.css'
import EmployeeLogin from '../../components/employee_components/EmployeeLogin'

function EmployeeLoginPage() {
  return (
    <div 
        style={{backgroundImage: "url(./images/logo.jpg)", backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}
        className='login_image'>
        <h4 className='title'>Welcome to Apex Innovations</h4>
        <EmployeeLogin />
    </div>
  )
}

export default EmployeeLoginPage