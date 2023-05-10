import React from 'react'
import AttendanceTable from '../../../components/admin_components/attendance_log/AttendanceTable'
import { useState } from 'react';

function AttendanceLog() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) =>{
      setSearchValue(e.target.value);
  }

  return (
    <>
      <div className='d-flex flex-column my-1'>
            <div className='col-md-3 my-3'>
                <input type="text" className="form-control" onChange={handleSearch} value={searchValue}  placeholder='Search Employee here' />
            </div>
            <AttendanceTable searchValue={searchValue} />
        </div>
    </>
  )
}

export default AttendanceLog
