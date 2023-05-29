import React from 'react'
import TimeLine from '../../../components/admin_components/attendance_log/TimeLine'
import AttendanceHourBox from '../../../components/admin_components/attendance_log/AttendanceHourBox'
import AttendanceDate from '../../../components/admin_components/attendance_log/AttendanceDate'
import { useState } from 'react'
import AttendanceRequestTable from '../../../components/admin_components/attendance_log/AttendanceRequestTable'

function AttendanceTimeLine() {
  const [date, setDate] = useState();
  const [hour, setTotalHour] = useState();

  return (
    <>
        <AttendanceRequestTable />
        <div className='d-flex justify-content-center my-4'>
            <div className='row'>
              <div className='col-md-5'>
                <AttendanceDate setDate={setDate} />
              </div>
              <div className='col-md-7'>
                <AttendanceHourBox hour={hour} />
              </div>
            </div>
            
        </div>
        <TimeLine date={date} setTotalHour={setTotalHour} />
    </>
  )
}

export default AttendanceTimeLine
