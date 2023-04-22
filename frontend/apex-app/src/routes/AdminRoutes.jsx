// import React from 'react'
// import { Routes, Route, Outlet, Navigate} from 'react-router-dom'
// import AdminLoginPage from '../pages/admin/AdminLogin'
// import ProtectedRoute from './ProtectedRoute'
// import Dashboard from '../pages/admin/AdminDashboard'
// import { useSelector } from 'react-redux'
// import { selectUser } from '../redux-toolkit/userSlice'
// import Employees from '../pages/admin/Employees'
// import Holiday from '../pages/admin/Holiday'
// import Salary from '../pages/admin/Salary'
// import AttendanceLog from '../pages/admin/AttendanceLog'


// function LoginRoute() {
//   const employee = useSelector(selectUser);

//   console.log(employee)
//   if (employee?.admin) {
//     return <Navigate to="/admin_dashboard" />;
//   } else {
//     return <AdminLoginPage />;
//   }
// }
// function AdminRoutes() {
//   return (
//     <>
//         <Routes>
//             <Route path="/admin" exact element={<LoginRoute />} />
//             <Route element={<ProtectedRoute  logoutPath="/admin"/>}>
//               <Route path="/" element={<Outlet />}>
//                 <Route path="admin_dashboard" element={<Dashboard />} />
//                 <Route path="employees" element={<Employees />} />
//                 <Route path="salary" element={<Salary />} />
//                 <Route path="holiday_list" element={<Holiday />} />
//                 <Route path="attendance_log" element={<AttendanceLog />} />
//               </Route>
//             </Route>
//         </Routes>
//     </>
//   )
// }

// export default AdminRoutes
