import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import useAxios from '../../../utilis/useAxios';
import PaginationTag from '../../pagination/PaginationTag';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../../utilis/baseUrl';

function EmployeeTable({searchValue}) {
  const params = useParams();
  const [employees, setEmployees] = useState([]);
  const [pages, setPages] = useState();
  const api = useAxios();
  const currentPage =  parseInt(params.pageNumber);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  
  const fetchEmployees = async()=>{
    try{
      let response = await api.get(`employees/list?page=${currentPage}&perPage=${itemsPerPage}&keyword=${searchValue}`);
      
      if (response.status === 200){
        setEmployees(response.data.employees);
        setPages(response.data.page_count);
      }
    }
    catch(error){
      
    }
  }
  
  useEffect(()=>{
    fetchEmployees();
  },[currentPage, itemsPerPage, searchValue])

  const handlePageChange = (pageNumber) => {
    navigate(`/employees/page/${pageNumber}`);
  };

  const handleViewClick = (employee) =>{
    navigate(`/employees/update/${employee.id}`)
  }


  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  console.log(employees)
  return (
    <>
      <Table>
        <thead style={{ backgroundColor: '#2b889b', color: '#ffffff' }}>
          <tr>
            <th>#</th>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Reporting Manager</th>
            <th>Position</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className='justify-content-center align-items-center'>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{startIndex + index + 1}</td>
              <td><img
                    src={`${employee.image ? baseURL + employee.image : "https://bootdey.com/img/Content/avatar/avatar7.png"}`}
                    alt="avatar"
                    className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                    width="60"
                  /></td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              {employee.is_manager ?
                <td>Manager</td> :
                <td>Employee</td>
              }
              <td>{employee.manager}</td>
              <td>{employee.designation_name}</td>
              <td><Button className='btn btn-primary' onClick={()=>handleViewClick(employee)}><FontAwesomeIcon icon={faEye} /> Edit</Button></td>
            </tr>
          ))}
      </tbody>
      </Table>

      <PaginationTag currentPage={currentPage} pageNumbers={pageNumbers} handlePageChange={handlePageChange}/>
    </>
  )
}

export default EmployeeTable
