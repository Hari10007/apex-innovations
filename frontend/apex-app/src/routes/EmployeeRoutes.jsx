import React from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate, Outlet} from 'react-router-dom'
import AttendancePage from '../pages/employee/Attendance'
import EmployeeLoginPage from '../pages/employee/EmployeeLogin'
import LeavePage from '../pages/employee/Leave'
import HolidayPage from '../pages/employee/Holiday'
import ProfilePage from '../pages/employee/Profile'
import ProjectPage from '../pages/employee/Project'
import { selectUser } from '../redux-toolkit/userSlice'

import ProtectedRoute from './ProtectedRoute'
import NoMatchPage from '../pages/employee/NoMatchPage'

function LoginRoute() {
    const employee = useSelector(selectUser);
  
    if (employee) {
      return <Navigate to="/attendance" />;
    } else {
      return <EmployeeLoginPage />;
    }
  }
  
function EmployeeRoutes() {
    return (
        <>
        <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route element={<ProtectedRoute  logoutPath="/login" status="employee" />}>
              <Route path="/" element={<Outlet />}>
                  <Route index path="attendance" element={<AttendancePage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="project" element={<ProjectPage />} />
                  <Route path="holiday" element={<HolidayPage />} />
                  <Route path="leave" element={<LeavePage />} />
                  <Route path="*" element={<NoMatchPage/>} />
            </Route>
            </Route>
        </Routes>
      </>
    );
}
  
  export default EmployeeRoutes;