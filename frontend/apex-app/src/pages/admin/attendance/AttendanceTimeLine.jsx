import React from 'react'
import TimeLine from '../../../components/admin_components/attendance_log/TimeLine'
import AttendanceHourBox from '../../../components/admin_components/attendance_log/AttendanceHourBox'

function AttendanceTimeLine() {
  return (
    <>
        <div className='d-flex justify-content-center my-4'>
            <AttendanceHourBox />
        </div>
        <TimeLine />
    </>
  )
}

export default AttendanceTimeLine
