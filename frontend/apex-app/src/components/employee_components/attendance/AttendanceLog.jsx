import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import useAxios from '../../../utilis/useAxios';
import TableScrollbar from 'react-table-scrollbar';

function AttendanceLog({attendanceUpdated, selectedDate}) {
  let api = useAxios()
  const [attendanceLogs, setAttendanceLogs] = useState([])

  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10);
  
    async function fetchData() {
      try {
        const date = (selectedDate ? new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 10) : currentDate)
        
        const response = await api.get(`api/attendance/log?&date=${date}`);

        if (response.status === 200) {
          setAttendanceLogs(response.data.log);
        } else {

          const message = response.data.message || 'An error occurred';
          console.error(message);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
 
    fetchData();
  }, [selectedDate, attendanceUpdated]);
  
  return (
    <div >
      <TableScrollbar rows={5}>
        <Table striped bordered hover>
          <thead style={{ backgroundColor: "#2b889b", color: "#ffffff" }}>
              <tr>
                  <th>Action</th>
                  <th>Time</th>
              </tr>
          </thead>
          <tbody>
            {attendanceLogs && attendanceLogs.length > 0 ? 

              (
                attendanceLogs.map((attendanceLog, index)=>(
                  <tr key={index}
                  style={{
                    backgroundColor: attendanceLog.is_check_in ? "#056c3c" : "#870411",
                    color: "white"
                  }}>
                    <td>{attendanceLog.is_check_in ? "Check In" : "Check Out "}</td>
                    <td>{attendanceLog.time}</td>
                  </tr>
                ))
              ) :
              <tr>
                    <td colSpan={2}>No attendance logs found</td>
              </tr>
            }
          </tbody>
          </Table>
      </TableScrollbar>
    </div>
  )
}

export default AttendanceLog
