import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import useAxios from '../../../utilis/useAxios';

const Leave = styled.button`
  background-color:${props => props.color} ; 
  color: white; 
  border: none;  
  text-align: center; 
  text-decoration: none;
  display: inline-block; 
  font-size: 18px; 
  cursor: pointer;
  width: 200pX; 
  height: 120px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

function Dashboard() {
    const [employee, setEmployee] = useState();
    const [manager, setManager] = useState();
    const [admin, setAdmin] = useState();
    const [hrManager, setHRManager] = useState();

    const api = useAxios();

    const fetchDetails = async ()=>{

        try{
            const response = await api.get('employees/count');

            if(response.status === 200){
                setEmployee(response.data.employees_count);
                setManager(response.data.managers_count);
                setAdmin(response.data.admins_count);
                setHRManager(response.data.hr_managers_count);
            }
        }
         catch (error) {
             console.error('fetchLeave error:', error);
        }
    }

    useEffect(() => {
        fetchDetails();
    }, [])
  
    return (
    <div className="d-flex justify-content-between">
        <Leave color={"#244b60"} ><h6>Employees</h6><p>{employee}</p></Leave>
        <Leave color={"#244b60"} ><h6>Managers</h6><p>{manager}</p></Leave>
        <Leave color={"#244b60"} ><h6>Admin</h6><p>{admin}</p></Leave>
        <Leave color={"#244b60"} ><h6>HR Manager</h6><p>{hrManager}</p></Leave>
    </div>
    )
}

export default Dashboard