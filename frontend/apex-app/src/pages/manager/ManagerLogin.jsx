import React from 'react'
import '../assets/css/Login.css'
import ManagerLogin from '../../components/manager_components/ManagerLogin'

function ManagerLoginPage() {
  return (
    <div 
        style={{backgroundImage: "url(./images/logo.jpg)", backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}
        className='login_image'>
        <h4 className='title'>Welcome to Apex Innovations</h4>
        <ManagerLogin />
    </div>
  )
}

export default ManagerLoginPage