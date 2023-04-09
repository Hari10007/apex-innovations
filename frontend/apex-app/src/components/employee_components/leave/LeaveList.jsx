import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import useAxios from '../../../utilis/useAxios';

const Leave = styled.button`
  background-color:${props => props.color} ; 
  color: white; 
  border: none; 
  border-radius: 50%; 
  text-align: center; 
  text-decoration: none;
  display: inline-block; 
  font-size: 17px; 
  cursor: pointer;
  width: 120pX; 
  height: 120px;
`;

function LeaveList() {
    const [casual, setCasual] = useState();
    const [sick, setSick] = useState();
    const [paid, setPaid] = useState();

    const api = useAxios();

    const fetchLeave = async ()=>{
        const currentYear = new Date().getFullYear();
        try{
            const response = await api.get(`api/leave/status?&year=${currentYear}`);

            if(response.status === 200){
                setCasual(response.data['Casual']);
                setSick(response.data['Sick']);
                setPaid(response.data['Paid']);
            }
        }
         catch (error) {
             console.error('fetchLeave error:', error);
        }
    }

    useEffect(() => {
        fetchLeave();
    }, [])
  
    return (
    <>
        <Leave color={"#244b60"} ><h6>Casual</h6><p>{casual}</p></Leave>
        <Leave color={"#244b60"} ><h6>Sick</h6><p>{sick}</p></Leave>
        <Leave color={"#244b60"} ><h6>L.O.P</h6><p>{paid}</p></Leave>
    </>
    )
}

export default LeaveList
