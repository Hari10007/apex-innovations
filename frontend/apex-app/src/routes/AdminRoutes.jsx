import React from 'react'
import { Routes, Route} from 'react-router-dom'
import AdminLoginPage from '../pages/admin/AdminLogin'

function AdminRoutes() {
  return (
    <>
        <Routes>
            <Route path="/admin" exact element={<AdminLoginPage />} />
        </Routes>
    </>
  )
}

export default AdminRoutes
