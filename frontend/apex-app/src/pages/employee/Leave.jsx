import React from 'react'
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import AlertMessage from '../../components/alert/Alert';
import Header from '../../components/employee_components/Header'
import ApplyLeave from '../../components/employee_components/leave/ApplyLeave';
import LeaveList from '../../components/employee_components/leave/LeaveList';
import LeaveTable from '../../components/employee_components/leave/LeaveTable';
import Sidebar from '../../components/employee_components/Sidebar'
import Loader from '../../components/loader/Loader';

function LeavePage() {
  const [modalShow, setModalShow] = useState(false);
  const [leaveUpdated , setLeaveUpdated] = useState(false);

  const handleLeaveUpdate = () => {
    setLeaveUpdated(!leaveUpdated);
  };
  
  return (
    <>
      <Loader />
      <Sidebar />
      <Header />
      <div className='container'>
        <AlertMessage />
        <div className='row'>
          <div className='col-md-12  d-flex justify-content-between'>
            <LeaveList />
          </div>
          <div className='col-md-12 my-4 d-flex justify-content-center'>
            <Button variant="primary" onClick={() => setModalShow(true)}>
             Apply Leave
            </Button>
            
            <ApplyLeave  handleLeaveUpdate={handleLeaveUpdate}  show={modalShow} onHide={() => setModalShow(false)}/>
          </div>
          <div className='col-md-12'>
            <LeaveTable leaveUpdated={leaveUpdated}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeavePage
