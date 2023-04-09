import React from 'react'
import { selectUser } from '../redux-toolkit/userSlice'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


const ProtectedRoute = ({ ...props }) => {
    console.log(props)
    const employee = useSelector(selectUser);

    if (props.status === "manager" && employee && employee.manager) {
        return <Outlet />;
    } else if (props.status === "employee" && employee) {
        return <Outlet />;
    } else {
        return <Navigate to={props.logoutPath} />;
    }
  
}

export default ProtectedRoute;
