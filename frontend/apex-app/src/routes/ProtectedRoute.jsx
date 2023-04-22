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
  
}

export default ProtectedRoute;
