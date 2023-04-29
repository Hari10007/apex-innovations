import React from 'react'
import SalaryDate from '../../../components/admin_components/salary/SalaryDate'
import SalaryLog from '../../../components/admin_components/salary/SalaryLog'
import { useState } from 'react'

function EmployeeSalaryLog() {
  const [date, setDate] = useState('')

  return (
    <>
       <div className='d-flex flex-column my-1'>
            <div className='col-md-3 my-3'>
                <SalaryDate setDate={setDate}/>
            </div>
            <SalaryLog date={date}/>
        </div>
    </>
  )
}

export default EmployeeSalaryLog
