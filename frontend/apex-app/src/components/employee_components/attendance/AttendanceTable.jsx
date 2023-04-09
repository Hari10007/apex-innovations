import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import useAxios from '../../../utilis/useAxios';
import Pagination from 'react-bootstrap/Pagination';

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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination >
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {pageNumbers.map((pageNumber) => (
            <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber)}>
              {pageNumber}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageNumbers.length} />
          <Pagination.Last onClick={() => handlePageChange(pageNumbers.length)} disabled={currentPage === pageNumbers.length} />
        </Pagination>
      </div>
    </div>
  );
}

export default AttendanceTable;
