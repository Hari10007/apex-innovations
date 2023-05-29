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
import Salary from '../pages/admin/salary/Salary'
import AdminDashboardPage from '../pages/admin/AdminDashboard'
import AttendanceLog from '../pages/admin/attendance/AttendanceLog'
import AttendanceTimeLine from '../pages/admin/attendance/AttendanceTimeLine'
import AdminAttendancePage from '../pages/admin/attendance/Attendance'
import EmployeesSalary from '../pages/admin/salary/EmployeesSalary'
import AttendanceList from '../pages/employee/attendance/AttendanceList'
import SalaryDetails from '../pages/admin/salary/SalaryDetails'
import ChatPage from '../pages/employee/chat/ChatPage'
import ChatList from '../pages/employee/chat/ChatList'
import ChatDetail from '../pages/employee/chat/ChatDetail'
import EmployeesPage from '../pages/admin/employees/Employees'
import EmployeeListPage from '../pages/admin/employees/EmployeeList'
import EmployeeUpdatePage from '../pages/admin/employees/EmployeeUpdate'
import EmployeeCreatePage from '../pages/admin/employees/EmployeeCreate'
import EmployeeSalary from '../pages/employee/salary/EmployeeSalary'
import EmployeesSalaryLog from '../pages/admin/salary/EmployeesSalaryLog'
import EmployeeSalaryLog from '../pages/employee/salary/EmployeeSalaryLog'
import AttendanceDetail from '../pages/admin/attendance/AttendanceDetail'

function LoginRoute() {
    const employee = useSelector(selectUser);

    // if (employee?.manager) {
    //   return <Navigate to="/dashboard" />;
    // }
    // else 
    if (employee?.admin) {
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
            <Route path="/" exact element={<Navigate to="/login" replace />} />

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

                      <Route path="salary" element={<EmployeeSalary/>} >
                        <Route index element={<Navigate to="page/1" replace />} />
                        <Route path="page/:pageNumber" element={<EmployeeSalaryLog/>} />
                      </Route>
                    </>
                  }

                  <Route path="holiday" element={<HolidayPage />} />
                  <Route path="leave" element={<LeavePage />} />
                  <Route path="chat" element={<ChatPage />}>
                        <Route index element={<Navigate to="lists" replace />} />
                        <Route path="lists" element={<ChatList/>} />
                        <Route path=":id" element={<ChatDetail/>} />
                  </Route>

                  {employee?.manager  && !employee.hr_manager && 
                    <>
                      {/* <Route path="dashboard" element={<DashboardPage />} /> */}
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
                      <Route path="employees" element={<EmployeesPage/>} >
                        <Route index element={<Navigate to="page/1" replace />} />
                        <Route path="page/:pageNumber" element={<EmployeeListPage/>} />
                        <Route path="update/:employeeId" element={<EmployeeUpdatePage/>} />
                        <Route path="create" element={<EmployeeCreatePage/>} />
                      </Route>
                      <Route path="attendances" element={<AdminAttendancePage/>} >
                        <Route index element={<Navigate to="page/1" replace />} />
                        <Route path="page/:pageNumber" element={<AttendanceLog/>} />
                        <Route path="log/:id" element={<AttendanceDetail/>} >
                          <Route index element={<Navigate to="page/1" replace />} />
                          <Route path="page/:pageNumber" element={<AttendanceTimeLine/>} />
                        </Route>
                      </Route>
                      <Route path="salary" element={<Salary/>} >
                        <Route index element={<Navigate to="page/1" replace />} />
                        <Route path="page/:pageNumber" element={<EmployeesSalary/>} />
                        <Route path="log/:id" element={<SalaryDetails/>} >
                          <Route index element={<Navigate to="page/1" replace />} />
                          <Route path="page/:pageNumber" element={<EmployeesSalaryLog/>} />
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