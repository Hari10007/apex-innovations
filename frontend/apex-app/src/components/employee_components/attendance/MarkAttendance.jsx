import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import useAxios from '../../../utilis/useAxios';
import moment from 'moment';

const CheckButton = styled.button`
  background-color:${props => props.color} ; 
  color: white; 
  border: none; 
  border-radius: 50%; 
  padding: 16px 20px; 
  text-align: center; 
  text-decoration: none;
  display: inline-block; 
  font-size: 16px; 
  margin: 4px 2px; 
  cursor: pointer;
  width: 120pX; 
  height: 120px;
`;

function MarkAttendance({handleAttendanceUpdate, selectedDate}) {
  let api = useAxios()
  const [lastCheck, setLastCheck] = useState("True");

  const fetchLastCheck = async () => {
    try {
      let now = new Date();
      // const currentDate =  new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
      const currentDate = moment(now).format('YYYY-MM-DD');

      const response = await api.get(`api/attendance/status?&date=${currentDate}`);

      if (response.status === 200) {
        setLastCheck(response.data.status)
      }
    } catch (error) {
      console.error('fetchLastCheck error:', error);
    }
  };

  useEffect(() => {   
    
    fetchLastCheck();
  }, []);

  
  let checkIn = async() =>{
    try {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
      // const currentDate =  new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
      const currentDate = moment(now).format('YYYY-MM-DD');
  
      let response = await api.post('api/attendance/check_in', {time: currentTime, date: currentDate});

      if(response.status === 200){
        setLastCheck("True")
        handleAttendanceUpdate();
      }
    } 
    catch (error) {
      console.error('getDetails error:', error);
    }
  }

  let checkOut = async() =>{
    try {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
      // const currentDate= now.toISOString().slice(0, 10);
      const currentDate = moment(now).format('YYYY-MM-DD');
      let response = await api.post('api/attendance/check_out',{time: currentTime, date: currentDate});

      if(response.status === 200){
        setLastCheck("False")
        handleAttendanceUpdate();
      }
    } 
    catch (error) {
      console.error('getDetails error:', error);
    }
  }

  return (
    <div >
      {selectedDate &&
        <CheckButton color={"#244b60"} disabled>Disabled</CheckButton>
      }
      {selectedDate === null && (lastCheck === "True" ? 
        <CheckButton color={"#870411"} onClick={() =>{ checkOut(); fetchLastCheck();}}>Check Out</CheckButton>:
        <CheckButton color={"#056c3c"}  onClick={()=>{checkIn(); fetchLastCheck();}}>Check In</CheckButton>
      )}
    </div>
  )
}

export default MarkAttendance
