import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Table } from 'react-bootstrap'
import useAxios from '../../../utilis/useAxios';
import Pagination from 'react-bootstrap/Pagination';
import PaginationTag from '../../pagination/PaginationTag';

function LeaveTable({leaveUpdated}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(7);
    const [leaves, setLeaves] = useState([]);

    const api = useAxios();

    const fetchLeave = async ()=>{
        
        try{
            const response = await api.get(
                `api/leave/list?page=${currentPage}&perPage=${itemsPerPage}`
              );

            if(response.status === 200){
                setLeaves(response.data);
            }
        }
         catch (error) {
             console.error('fetchLeave error:', error);
        }
    }
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const pages = Math.ceil(leaves.length / itemsPerPage);
    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = leaves.slice(startIndex, endIndex);


    useEffect(() => {
        fetchLeave();
    }, [leaveUpdated])

    return (
        <>
            <Table>
                <thead style={{ backgroundColor: '#2b889b', color: '#ffffff' }}>
                <tr>
                    <th>#</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((leave, index) => (
                    <tr key={index}>
                    <td>{startIndex + index + 1}</td>
                    <td>{leave.leave_name}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.taken_days}</td>
                    {leave.status === "A" &&
                        <td> <span className="badge rounded-pill bg-success">{leave.status}</span> </td>}
                    {leave.status === "P" &&
                        <td> <span className="badge rounded-pill bg-warning">{leave.status}</span> </td>}
                    {leave.status === "R" &&
                        <td> <span className="badge rounded-pill bg-danger">{leave.status}</span> </td>}
                    </tr>
                ))}
                </tbody>
            </Table>
            
            <PaginationTag currentPage={currentPage} pageNumbers={pageNumbers} handlePageChange={handlePageChange}/>
        </>
    )
}

export default LeaveTable
