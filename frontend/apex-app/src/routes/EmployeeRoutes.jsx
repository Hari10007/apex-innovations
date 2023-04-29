import React from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate, Outlet} from 'react-router-dom'
import AttendancePage from '../pages/employee/attendance/Attendance'
import EmployeeLoginPage from '../pages/employee/EmployeeLogin'
import LeavePage from '../pages/employee/Leave'
import HolidayPage from '../pages/employee/Holiday'
import ProfilePage from '../pages/employee/Profile'
import ProjectPage from '../pages/employee/project/Project'
import { selectUser } from '../redux-toolkit/userSlice'
import LeaveManagementPage from '../pages/manager/LeaveManagement';
import DashboardPage from '../pages/manager/Dashboard';
import LeaveRequestList from '../components/manager_components/leave_management/LeaveRequestList';
import LeaveRequest from '../components/manager_components/leave_management/LeaveRequest';

import ProtectedRoute from './ProtectedRoute'
import NoMatchPage from '../pages/employee/NoMatchPage'
import ProjectList from '../pages/employee/project/ProjectList'
import CreateProject from '../pages/employee/project/CreateProject'
import ProjectDetails from '../pages/employee/project/ProjectDetails'
import Employees from '../pages/admin/Employees'
import Salary from '../pages/admin/salary/Salary'
import AdminDashboardPage from '../pages/admin/AdminDashboard'
import AttendanceLog from '../pages/admin/attendance/AttendanceLog'
import AttendanceTimeLine from '../pages/admin/attendance/AttendanceTimeLine'
import AdminAttendancePage from '../pages/admin/attendance/Attendance'
import EmployeeSalary from '../pages/admin/salary/EmployeeSalary'
import AttendanceList from '../pages/employee/attendance/AttendanceList'
import SalaryDetails from '../pages/admin/salary/SalaryDetails'
import EmployeeSalaryLog from '../pages/admin/salary/EmployeeSalaryLog'

function LoginRoute() {
    const employee = useSelector(selectUser);

    if (employee?.manager) {
      return <Navigate to="/dashboard" />;
    }
    else if (employee?.admin) {
      return <Navigate to="/admin_dashboard" />;
    } 
    else if (employee) {
      return <Navigate to="/attendance" />;
    } else {
      return <EmployeeLoginPage />;
    }
  }
  
function EmployeeRoutes() {
    const employee = useSelector(selectUser);

    return (
      <>
        <Routes>
            <Route path="/" exact element={<LoginRoute />} />

            <Route path="/login" exact element={<LoginRoute />} />
            <Route element={<ProtectedRoute  logoutPath="/login"/>}>
              <Route path="/" element={<Outlet />}>
                  <Route path="profile" element={<ProfilePage />} />

                  {!employee?.admin && 
                    <>
                      <Route path="attendance" element={<AttendancePage />} >
                        <Route index element={<Navigate to="page/1" replace />} />
                        <Route path="page/:pageNumber" element={<AttendanceList/>} />
                      </Route>
                      <Route path="project" element={<ProjectPage />} >
                        <Route index element={<Navigate to="page/1" replace />} />
                        <Route path="page/:pageNumber" element={<ProjectList/>} />
                        <Route path="create_project" element={<CreateProject/>} />
                        <Route path=":projectId" element={<ProjectDetails />} />
                      </Route>
                    </>
                  }

                  <Route path="holiday" element={<HolidayPage />} />
                  <Route path="leave" element={<LeavePage />} />
                  {employee?.manager && 
                    <>
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="leave_management" element={<LeaveManagementPage />}>
                        <Route index element={<Navigate to="leave_requests" replace />} />
                        <Route path="leave_requests" element={<LeaveRequestList/>} />
                        <Route path="leave_requests/:id" element={<LeaveRequest/>} />
                      </Route>
                    </>
                  }
                  
                  {employee?.admin && 
                    <>
                      <Route path="admin_dashboard" element={<AdminDashboardPage />} />
                      <Route path="employees" element={<Employees />} />
                      <Route path="attendances" element={<AdminAttendancePage/>} >
                        <Route index element={<Navigate to="log" replace />} />
                        <Route path="log" element={<AttendanceLog/>} />
                        <Route path="log/:id" element={<AttendanceTimeLine/>} />
                      </Route>
                      <Route path="salary" element={<Salary/>} >
                        <Route index element={<Navigate to="page/1" replace />} />
                        <Route path="page/:pageNumber" element={<EmployeeSalary/>} />
                        <Route path="log/:id" element={<SalaryDetails/>} >
                          <Route index element={<Navigate to="page/1" replace />} />
                          <Route path="page/:pageNumber" element={<EmployeeSalaryLog/>} />
                        </Route>
                      </Route>
                    </>
                  }
                  <Route path="*" element={<NoMatchPage/>} />
              </Route>
            </Route>
        </Routes>
      </>
    );
}
  
  export default EmployeeRoutes;