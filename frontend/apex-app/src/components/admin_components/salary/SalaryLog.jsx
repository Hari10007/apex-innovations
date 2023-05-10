import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import useAxios from '../../../utilis/useAxios';
import { useNavigate, useParams } from 'react-router-dom';
import PaginationTag from '../../pagination/PaginationTag';
import moment from 'moment';
import SalarySlipModal from './SalarySlipModal';

function SalaryLog({date}) {
    const params = useParams();
    const [employee_salaries, setEmployeeSalaries] = useState([]);
    const [pages, setPages] = useState();
    const api = useAxios();
    const currentPage =  parseInt(params.pageNumber);
    const itemsPerPage = 7;
    const navigate = useNavigate();
    const [employee_salary, setEmployeeSalary] = useState([]);

    console.log(employee_salary)

    const [modalShow, setModalShow] = useState(false);

    const [salarySlipUpdated, setSalarySlipUpdated] = useState(false);

    const handle_salary = () => {
        setSalarySlipUpdated(!salarySlipUpdated);
    };

    const fetchSalaryLog = async()=>{
        try{
        let response = await api.get(`salary/list?employee=${params?.id}&page=${currentPage}&perPage=${itemsPerPage}&date=${date}`);

        if (response.status === 200){
            setEmployeeSalaries(response.data.employee_salaries);
            setPages(response.data.page_count);
        }
        }
        catch(error){

        }
    }

    useEffect(()=>{
        fetchSalaryLog();
    },[currentPage, itemsPerPage, date, salarySlipUpdated])

    const handlePageChange = (pageNumber) => {
        navigate(`/salary/log/${params?.id}/page/${pageNumber}`);
    };

    let handleSalary = (employee_salary)=>{
        setEmployeeSalary(employee_salary)
        setModalShow(true)
    }


    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

    const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <>
      <Table>
        <thead style={{ backgroundColor: '#2b889b', color: '#ffffff' }}>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Salary Slip</th>
            <th>Action</th>
          </tr>
        </thead>
        
        <tbody>
        {employee_salaries?.map((employee_salary, index) => (
            <tr key={index}>
              <td>{startIndex + index + 1}</td>
              <td>{moment(employee_salary.salary_date).format('MMMM YYYY')}</td>
              {employee_salary.salary_slip?
                    <td><span className="badge rounded-pill p-2 bg-success">Generated</span></td>
                    :
                    <td><span className="badge rounded-pill p-2 bg-danger">Not Generated</span></td>
              }
              <td><Button className='btn btn-primary'  onClick={() => handleSalary(employee_salary)}><FontAwesomeIcon icon={faMoneyCheckDollar} /> Generate Slip</Button></td>
            </tr>
          ))}
         
        </tbody>
      </Table>
        
       <SalarySlipModal handle_salary={handle_salary} employee_salary={employee_salary} show={modalShow} onHide={() => setModalShow(false)}/>
       <PaginationTag currentPage={currentPage} pageNumbers={pageNumbers} handlePageChange={handlePageChange}/>
    </>
  )
}

export default SalaryLog
