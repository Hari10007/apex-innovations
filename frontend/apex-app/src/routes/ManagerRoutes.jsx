// import React from 'react'
// import { Routes, Route, Navigate, Outlet} from 'react-router-dom'
// import ManagerLoginPage from '../pages/manager/ManagerLogin'
// import { useSelector } from 'react-redux';
// import { selectUser } from '../redux-toolkit/userSlice';
// import ProtectedRoute from './ProtectedRoute';
// import LeaveManagementPage from '../pages/manager/LeaveManagement';
// import DashboardPage from '../pages/manager/Dashboard';
// import LeaveRequestList from '../components/manager_components/leave_management/LeaveRequestList';
// import LeaveRequest from '../components/manager_components/leave_management/LeaveRequest';


// function ManagerLoginRoute() {
//   const employee = useSelector(selectUser);

//   if (employee?.manager) {
//     return <Navigate to="/manager/dashboard" />;
//   } else {
//     return <ManagerLoginPage />;
//   }
// }

// function ManagerRoutes() {
  
//   return (
//     <>
//         <Routes>
//           <Route path="/manager" exact element={<ManagerLoginRoute />} />
//           <Route element={<ProtectedRoute logoutPath="/manager" status="manager"/>}>
//             <Route path="/manager" element={<Outlet />}>
//               <Route path="dashboard" element={<DashboardPage />} />
//               <Route path="leave_management" element={<LeaveManagementPage />}>
//                 <Route path="" element={<Navigate to="leave_requests" replace />} />
//                 <Route path="leave_requests" element={<LeaveRequestList/>} />
//                 <Route path="leave_requests/:id" element={<LeaveRequest/>} />
//               </Route>
//             </Route>
//           </Route>
//         </Routes>
//     </>

//   )
// }

// export default ManagerRoutes
