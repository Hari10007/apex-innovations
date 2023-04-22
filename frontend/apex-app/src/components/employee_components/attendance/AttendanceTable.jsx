import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import useAxios from '../../../utilis/useAxios';
import PaginationTag from '../../pagination/PaginationTag';

function AttendanceTable({ attendanceUpdated ,selectedDate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [attendances, setAttendances] = useState([]);

  const api = useAxios();

  useEffect(() => {
    async function fetchData() {
     
      const date = (selectedDate ? new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 10) : false)
      const response = await api.get(
        `api/attendance/list?page=${currentPage}&perPage=${itemsPerPage}&date=${date}`
      );

      if (response.status === 200) {
        setAttendances(response.data);
      }
    }
    fetchData();
  }, [currentPage, itemsPerPage, selectedDate, attendanceUpdated]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pages = Math.ceil(attendances.length / itemsPerPage);
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = attendances.slice(startIndex, endIndex);

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
          {currentItems.map((attendance, index) => (
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
