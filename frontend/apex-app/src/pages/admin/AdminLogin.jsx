import React from 'react'
import '../assets/css/Login.css'
import AdminLogin from '../../components/admin_components/AdminLogin'


function AdminLoginPage() {
  return (
    <div 
        style={{backgroundImage: "url(./images/logo.jpg)", backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}
        className='login_image'>
        <h4 className='title'>Welcome to Apex Innovations</h4>
        <AdminLogin />
    </div>
  )
}

export default AdminLoginPage