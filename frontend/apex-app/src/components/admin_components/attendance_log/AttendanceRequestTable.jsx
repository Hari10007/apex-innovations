import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import useAxios from '../../../utilis/useAxios';
import PaginationTag from '../../pagination/PaginationTag';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck , faSquareXmark} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { setMessage } from '../../../redux-toolkit/messageSlice';
import { useDispatch } from 'react-redux';

function AttendanceRequestTable({searchValue}) {
    const params = useParams();
    const [attendances, setAttendances] = useState([]);
    const [pages, setPages] = useState();
    const api = useAxios();
    const currentPage =  parseInt(params.pageNumber);
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [attendanceUpdated, setAttendanceUpdated] = useState(false);
    
    const fetchAttendances = async()=>{
        try{
        const response = await api.get(
            `attendance/request/list?page=${currentPage}&perPage=${itemsPerPage}&employee_id=${params?.id}`
            );
            
            if (response.status === 200) {
              setAttendances(response.data.attendances);
              setPages(response.data.page_count);
            }
            if (response.data.attendances.length === 0 && currentPage > 1) {
              navigate(`/attendances/log/${params.id}/page/${currentPage - 1}`);
            }
        }catch(error){
          if (error.response && error.response.status === 404 && currentPage > 1) {
            navigate(`/attendances/log/${params.id}/page/${currentPage - 1}`);
          }
        }
    }
    
  
    const handlePageChange = (pageNumber) => {
      navigate(`/attendances/log/${params.id}/page/${pageNumber}`);
    };
    
    const handleApprove =  async(attendance)=>{
        try{
            const response = await api.post('attendance/request_approve' ,{
              'attendance_id': attendance.id
             });
            
            if (response.status === 200) {
              dispatch(setMessage({ message: response.data.message, type: response.data.status }));
              setAttendanceUpdated(!attendanceUpdated);
            }
        }catch(error){

        }
    }
    
    const handleReject =  async(attendance)=>{
        try{
          const response = await api.post('attendance/request_reject' ,{
            'attendance_id': attendance.id
            });
            
            if (response.status === 200) {
              dispatch(setMessage({ message: response.data.message, type: response.data.status }));
              setAttendanceUpdated(!attendanceUpdated);
            }
        }catch(error){

        }
    }

    useEffect(()=>{
      fetchAttendances();
    },[currentPage, itemsPerPage, attendanceUpdated])

    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

    const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <>
      <Table>
        <thead style={{ backgroundColor: '#2b889b', color: '#ffffff' }}>
          <tr>
            <th>#</th>
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
              <td>{attendance.date}</td>
              <td>{attendance.check_in}</td>
              <td>{attendance.check_out}</td>
              <td>{attendance.working_time}</td>
              <td>
                <div className="d-flex justify-content-center">
                    <Button className='btn btn-success mx-2' onClick={()=>handleApprove(attendance)}><FontAwesomeIcon icon={faCheck} /></Button>
                    <Button className='btn btn-danger mx-2' onClick={()=>handleReject(attendance)}><FontAwesomeIcon icon={faSquareXmark} /></Button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
      </Table>

     {attendances.length > 0 ? 
        <PaginationTag currentPage={currentPage} pageNumbers={pageNumbers} handlePageChange={handlePageChange}/>
        :
        <h3>No request pending</h3>
     }
    </>
  )
}

export default AttendanceRequestTable
