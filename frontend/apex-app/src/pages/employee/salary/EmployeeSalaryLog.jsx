import React from 'react'
import SalaryDate from '../../../components/admin_components/salary/SalaryDate'
import { useState } from 'react'
import SalaryLogTable from '../../../components/employee_components/salary/SalaryLogTable'


function EmployeeSalaryLog() {
  const [date, setDate] = useState('')

  return (
    <>
       <div className='d-flex flex-column my-1'>
          <div className='row justify-content-between'>
            <div className='col-md-3 my-3'>
                <SalaryDate setDate={setDate}/>
            </div>
          </div>
            <SalaryLogTable date={date} />
        </div>
    </>
  )
}

export default EmployeeSalaryLog