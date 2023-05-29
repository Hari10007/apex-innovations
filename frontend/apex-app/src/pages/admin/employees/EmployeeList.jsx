import React from 'react'
import { useState } from 'react';
import EmployeeTable from '../../../components/admin_components/employees/EmployeeTable';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../../../components/alert/Alert';
import EmployeDesignationForm from '../../../components/admin_components/employees/EmployeeDesignationForm';

function EmployeeListPage() {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const [designationUpdated, setDesignationUpdated] = useState(false);
  const[modalShow, setModalShow] = useState(false);

  const handleDesignation = () => {
    setDesignationUpdated(!designationUpdated);
  };


  const handleSearch = (e) =>{
      setSearchValue(e.target.value);
  }

  return (
    <>
      <div className='d-flex flex-column my-1'>
        <div className='d-flex flex-row my-1 justify-content-between'>
            <div className='col-md-3 my-3'>
                <input type="text" className="form-control" onChange={handleSearch} value={searchValue}  placeholder='Search Employee here' />
            </div>
            <div className="col-md-4 my-3">
                <div className="d-flex">
                    <Button variant="primary" className="me-2" onClick={() => setModalShow(true)}>
                        <i className="fa-solid fa-plus"></i> Create Designation
                    </Button>
                    <EmployeDesignationForm handleDesignation={handleDesignation} show={modalShow} onHide={() => setModalShow(false)} />
                    <Button variant="primary" onClick={() => navigate("/employees/create")}>
                    <i className="fa-solid fa-plus"></i> Add Employee
                    </Button>
                </div>
            </div>
        </div>
            <EmployeeTable searchValue={searchValue} />
        </div>
    </>
  )
}

export default EmployeeListPage
