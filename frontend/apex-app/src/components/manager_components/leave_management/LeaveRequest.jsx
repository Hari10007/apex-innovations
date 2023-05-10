import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '../../../utilis/useAxios';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../redux-toolkit/messageSlice';

function LeaveRequest() {
  const params= useParams();
  const api  = useAxios();
  const dispatch = useDispatch();
  const [employeeLeave , setEmployeeLeave] = useState();
  const navigate = useNavigate();

  const approveLeave = async () => {
    try {
      const response = await api.post(`leave/leave_requests/${params.id}/approve`);
      if (response.status === 200) {
        setEmployeeLeave((prevEmployeeLeave) => ({
          ...prevEmployeeLeave,
          status: 'A',
        }));
        dispatch(setMessage({ message: response.data.message, type: response.data.status }));
      }
    } catch (error) {
      console.log('approveLeave error:', error);
    }
  };

  const rejectLeave = async () => {
    try {
      const response = await api.post(`leave/leave_requests/${params.id}/reject`);
      if (response.status === 200) {
        setEmployeeLeave((prevEmployeeLeave) => ({
          ...prevEmployeeLeave,
          status: 'R',
        }));
        dispatch(setMessage({ message: response.data.message, type: response.data.status }));
      }
    } catch (error) {
      console.log('rejectLeave error:', error);
    }
  };

  const fetchEmployeeLeave = async (id) =>{
    try{
      const response = await api.get(`leave/leave_requests/${id}`);

      if (response.status === 200){
        setEmployeeLeave(response.data);
      }
    }
    catch (error){
      console.log('fetchEmployeeLeave error:', error)
    }
  }
  

  useEffect(() => {
    fetchEmployeeLeave(params.id);
  }, [employeeLeave?.status])
 

  return (
    <>
      <div className='row d-flex'>
        <div className='col-md-10'>
          <h1>Leave Details</h1>
        </div>
        <div className='col-md-2 align-items-right justify-content-end'>
          <Button onClick={() => navigate('../')}> <i className="fa-solid fa-arrow-left" style={{fontSize:'2'}}></i>  Back</Button>
        </div>
      </div>
      
      <div className='row'>
        <div className='col-md-12 d-flex justify-content-start'>
          <h4>Employee Information</h4>
        </div>
      </div>

      <div className='row my-3 d-flex justify-content-start'>
        <div className='col-md-4 d-flex flex-column align-items-start'>
          <h6>First Name</h6>
          <p>{employeeLeave?.first_name}</p>
        </div>
        <div className='col-md-4  d-flex  flex-column align-items-start'>
          <h6>Last Name</h6>
          <p>{employeeLeave?.last_name}</p>
        </div>
        <div className='col-md-4  d-flex  flex-column align-items-start'>
          <h6>Designation</h6>
          <p>{employeeLeave?.designation}</p>
        </div>
      </div>

      <div className='row'>
        <div className='col-md-12 d-flex justify-content-start'>
          <h4>Leave Period</h4>
        </div>
      </div>

      <div className='row my-3 d-flex justify-content-start'>
        <div className='col-md-4 d-flex flex-column align-items-start'>
          <h6>Start Date</h6>
          <p>{employeeLeave?.start_date}</p>
        </div>
        <div className='col-md-4  d-flex  flex-column align-items-start'>
          <h6>End Date</h6>
          <p>{employeeLeave?.end_date}</p>
        </div>
        <div className='col-md-4  d-flex  flex-column align-items-start'>
          <h6>Leave Type</h6>
          <p>{employeeLeave?.leave_name}</p>
        </div>
      </div>

      <div className='row'>
        <div className='col-md-12 d-flex justify-content-start'>
          <h4>Reason</h4>
        </div>
      </div>

      <div className='row my-4 d-flex justify-content-start'>
        <div className='col-md-12'>
        <textarea readOnly value={employeeLeave?.reason} className='w-100' />
        </div>
      </div>
      
      <div className='row'>
        <div className='col-md-12 d-flex justify-content-center'>
        {employeeLeave?.status === 'P' ? (
          <>
            <Button className='bg-success me-2' onClick={() => approveLeave()}>Approve</Button>
            <Button className='bg-danger' onClick={() => rejectLeave()}>Reject</Button>
          </>
          ) : (employeeLeave?.status === "A" ? (
            <span className="badge rounded-pill bg-success" style={{ fontSize: "18px" }}>Approved</span>
          ) :  <span className="badge rounded-pill bg-danger" style={{ fontSize: "18px" }}>Rejected</span>)}
        </div>
      </div>

    </>
  )
}

export default LeaveRequest
