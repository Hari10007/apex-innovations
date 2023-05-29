import React from 'react'
import SalaryDate from '../../../components/admin_components/salary/SalaryDate'
import SalaryLog from '../../../components/admin_components/salary/SalaryLog'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import SalaryFormModal from '../../../components/admin_components/salary/SalaryFormModal'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import useAxios from '../../../utilis/useAxios'
import { baseURL } from '../../../utilis/baseUrl'
import { useSelector } from 'react-redux'
import { selectedValue } from '../../../redux-toolkit/componentUpdateSlice'

function EmployeesSalaryLog() {
  const [date, setDate] = useState('');
  const salaryUpdated = useSelector(selectedValue);
  const[modalShow, setModalShow] = useState(false);
  const params = useParams();
  const api = useAxios();
  const [employee, setEmployee] = useState();
  const [salaryRequestCount, setSalaryRequestCount] = useState();


  const fetchEmployee = async (employeeId)=>{
    try{
        const response = await api.get(`employee/${employeeId}`);

        if (response.status === 200){
          setEmployee(response.data)
        }
    }
    catch (error){

    }
  }

  const fetchSalaryRequest = async (employeeId)=>{
    try{
        const response = await api.get(`salary/request/${employeeId}`);

        if (response.status === 200){
          setSalaryRequestCount(response.data)
        }
    }
    catch (error){

    }
  }

  useEffect(() =>{
    fetchSalaryRequest(params?.id);
  },[salaryUpdated])

  useEffect(() =>{
    fetchEmployee(params?.id);
  },[])

  return (
    <>
       <div className='d-flex flex-column my-1'>
          <div className='row justify-content-between'>
            <div className='col-md-3 my-3'>
                <SalaryDate setDate={setDate}/>
            </div>
            <div className='col-md-3 my-3'>
                    <Button variant="primary"  onClick={() => setModalShow(true)}>
                             Create Salary
                    </Button>
                    <SalaryFormModal show={modalShow} onHide={() => setModalShow(false)} />
            </div>
          </div>
          <div className='row justify-content-between'>
            <div className='col-md-3 my-3 d-flex flex-row align-items-center '>
                <img
                    src={`${employee?.image ? baseURL + employee?.image : "https://bootdey.com/img/Content/avatar/avatar7.png"}`}
                    alt="avatar"
                    className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                    width="60"
                  />
                <div className='d-flex flex-column justify-content-start'>
                  <h4>{employee?.name}</h4>
                  <h6>{employee?.email}</h6>
                </div>
            </div>
            <div className='col-md-3 my-3'>
              <h4>PaySlip Request: {salaryRequestCount}</h4>
            </div>
          </div>
            <SalaryLog date={date}/>
        </div>
    </>
  )
}

export default EmployeesSalaryLog
