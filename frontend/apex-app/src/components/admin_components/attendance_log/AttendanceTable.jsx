import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import useAxios from '../../../utilis/useAxios';
import PaginationTag from '../../pagination/PaginationTag';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function AttendanceTable() {

  const [currentPage, setCurrentPage] = useState(parseInt(sessionStorage.getItem('attendance_currentPage') || 1));
  const itemsPerPage = 10;
  const [attendances, setAttendances] = useState([]);
  const [pages, setPages] = useState();
  const navigate = useNavigate();

  const api = useAxios();

  useEffect(() => {
    async function fetchData() {
     
      const date = false
      const response = await api.get(
        `api/attendance/list?page=${currentPage}&perPage=${itemsPerPage}&date=${date}`
      );

      if (response.status === 200) {
        setAttendances(response.data.attendances);
        setPages(response.data.page_count);
        console.log(response.data.attendances)
      }
    }
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    sessionStorage.setItem('attendance_currentPage', pageNumber);
  };

  const handleViewClick = (attendance) => {
    navigate(`/attendances/log/${attendance.id}`);
  };



  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className='container'>
      <Table>
        <thead style={{ backgroundColor: '#2b889b', color: '#ffffff' }}>
          <tr>
            <th>#</th>
            <th>Employee</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Total Hours</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((attendance, index) => (
            <tr key={index}>
              <td>{startIndex + index + 1}</td>
              <td>{attendance.employee}</td>
              <td>{attendance.date}</td>
              <td>{attendance.check_in}</td>
              <td>{attendance.check_out}</td>
              <td>{attendance.working_time}</td>
              <td><Button className='btn btn-primary' onClick={()=>handleViewClick(attendance)}><FontAwesomeIcon icon={faEye} /> View</Button></td>
            </tr>
          ))}
      </tbody>
      </Table>

      <PaginationTag currentPage={currentPage} pageNumbers={pageNumbers} handlePageChange={handlePageChange}/>
    </div>
  )
}

export default AttendanceTable
