import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import useAxios from '../../../utilis/useAxios';
import { useNavigate, useParams } from 'react-router-dom';
import PaginationTag from '../../pagination/PaginationTag';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { PDFDownloadLink } from '@react-pdf/renderer';
import SalarySlipPdf from './SalarySlipPdf';
import { setMessage } from '../../../redux-toolkit/messageSlice';

function SalaryLogTable({date}) {
    const params = useParams();
    const [employee_salaries, setEmployeeSalaries] = useState([]);
    const [pages, setPages] = useState();
    const api = useAxios();
    const currentPage =  parseInt(params.pageNumber);
    const itemsPerPage = 7;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [paySlipRequest, setPaySlipRequest] = useState(false);
    const [employee_salary, setEmployeeSalary] = useState([])


    const fetchSalaryLog = async()=>{
        try{
          let response = await api.get(`salary/list?&page=${currentPage}&perPage=${itemsPerPage}&date=${date}`);

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
    },[currentPage, itemsPerPage, date, paySlipRequest])

    const handlePageChange = (pageNumber) => {
        navigate(`/salary/page/${pageNumber}`);
    };

    let handleRequest = async(employee_salary)=>{
        try{
            let response = await api.post('salary/payslip_request',{
              employee_salary: employee_salary.id
            });
  
            if (response.data){
                dispatch(setMessage({ message: response.data.message, type: response.data.status }));
                setPaySlipRequest(!paySlipRequest)
            }
          }
          catch(error){
  
          }
    }

    console.log(employee_salaries)
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
              {employee_salary.salary_slip?
                <td>
                    <PDFDownloadLink document={<SalarySlipPdf />} filename="FORM">
                        <Button className='btn btn-primary'  style={{ flex: 1, minWidth: '150px', marginRight: '5px' }}><FontAwesomeIcon icon={faDownload} /> Download</Button>
                    </PDFDownloadLink>
                </td>
                :employee_salary.payslip_request ? (
                  <td>
                    <span className="badge rounded-pill p-2 bg-success">Requested</span>
                  </td>
                ) : (
                  <td>
                    <Button className="btn btn-primary" style={{ flex: 1, minWidth: '150px', marginRight: '5px' }} onClick={() => handleRequest(employee_salary)}>
                      Request
                    </Button>
                  </td>
                )
                }
               
            </tr>
          ))}
         
        </tbody>
      </Table>
      <PaginationTag currentPage={currentPage} pageNumbers={pageNumbers} handlePageChange={handlePageChange}/>
        
    </>
  )
}

export default SalaryLogTable
