import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Pagination, Table } from 'react-bootstrap';
import useAxios from '../../../utilis/useAxios';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';


function LeaveRequestList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [leavesRequests, setLeaveRequests] = useState([]);
    const navigate = useNavigate();

    const api = useAxios();

    const fetchLeaveRequests = async ()=>{
        
        try{
            const response = await api.get(
                `api/leave/leave_requests?page=${currentPage}&perPage=${itemsPerPage}`
              );

            if(response.status === 200){
                setLeaveRequests(response.data);
            }
        }
         catch (error) {
             console.error('fetchLeave error:', error);
        }
    }

    const handleViewClick = (leave_request) => {
        navigate(`/manager/leave_management/leave_requests/${leave_request.id}`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const pages = Math.ceil(leavesRequests.length / itemsPerPage);
    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = leavesRequests.slice(startIndex, endIndex);

    useEffect(() => {
        fetchLeaveRequests();
    }, [])
    return (
        <>
                <Table>
                    <thead style={{ backgroundColor: '#2b889b', color: '#ffffff' }}>
                    <tr>
                        <th>#</th>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Days</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((leave_request, index) => (
                        <tr key={index}>
                        <td>{startIndex + index + 1}</td>
                        <td>{leave_request.employee_name}</td>
                        <td>{leave_request.leave_name}</td>
                        <td>{leave_request.start_date}</td>
                        <td>{leave_request.end_date}</td>
                        <td>{leave_request.taken_days}</td>
                        {leave_request.status === "A" &&
                            <td> <span className="badge rounded-pill bg-success">{leave_request.status}</span> </td>}
                        {leave_request.status === "P" &&
                            <td> <span className="badge rounded-pill bg-warning">{leave_request.status}</span> </td>}
                        {leave_request.status === "R" &&
                            <td> <span className="badge rounded-pill bg-danger">{leave_request.status}</span> </td>}
                        <td><Button onClick={() => handleViewClick(leave_request)}>View</Button></td>
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
            </>
    )
}

export default LeaveRequestList
