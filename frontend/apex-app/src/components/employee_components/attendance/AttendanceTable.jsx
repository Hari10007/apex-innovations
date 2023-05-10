import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import useAxios from '../../../utilis/useAxios';
import PaginationTag from '../../pagination/PaginationTag';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';


function AttendanceTable({ attendanceUpdated ,selectedDate }) {
  
  const params = useParams();
  const currentPage =  parseInt(params.pageNumber);
  const [attendances, setAttendances] = useState([]);
  const [pages, setPages] = useState();
  const itemsPerPage = 7;
  const navigate = useNavigate();

  const api = useAxios();

  useEffect(() => {
    async function fetchData() {
      try{
        // const date = (selectedDate ? new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 10) : false)
        const date = (selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : false)

        const response = await api.get(
          `attendance/list?page=${currentPage}&perPage=${itemsPerPage}&date=${date}`
          );
          
          if (response.status === 200) {
            setAttendances(response.data.attendances);
            setPages(response.data.page_count);
            }
        }catch(error){

        }
    }
    fetchData();
  }, [currentPage, itemsPerPage, selectedDate, attendanceUpdated]);

  const handlePageChange = (pageNumber) => {
    navigate(`/attendance/page/${pageNumber}`);
  };


  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className='container'>
      <Table>
        <thead style={{ backgroundColor: '#2b889b', color: '#ffffff' }}>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((attendance, index) => (
            <tr key={index}>
              <td>{startIndex + index + 1}</td>
              <td>{attendance.date}</td>
              <td>{attendance.check_in}</td>
              <td>{attendance.check_out}</td>
              <td>{attendance.working_time}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <PaginationTag currentPage={currentPage} pageNumbers={pageNumbers} handlePageChange={handlePageChange}/>
    </div>
  );
}

export default AttendanceTable;
