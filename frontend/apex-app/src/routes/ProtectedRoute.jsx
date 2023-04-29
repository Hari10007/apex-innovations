import React from 'react'
import { selectUser } from '../redux-toolkit/userSlice'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


const ProtectedRoute = ({ ...props }) => {

    const employee = useSelector(selectUser);

    if (employee) {
        return <Outlet />;
    } else {
        return <Navigate to={props.logoutPath} />;
    }

//     if (employee && !employee?.admin && !employee?.manager && !adminOnly  && !managerOnly) {
//         return <Outlet />;
//     }
//     else if (employee && employee?.manager  && managerOnly) {
//         return <Outlet />;
// } 
//     else if (employee && employee?.admin  && adminOnly) {
//             return <Outlet />;
//     } else {
//         return <Navigate to={props.logoutPath} />;
//     }
  
  
}

export default ProtectedRoute;
