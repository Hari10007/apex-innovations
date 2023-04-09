import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import AttendanceLog from '../../components/employee_components/attendance/AttendanceLog'
import AttendanceTable from '../../components/employee_components/attendance/AttendanceTable'
import MarkAttendance from '../../components/employee_components/attendance/MarkAttendance'
import Header from '../../components/employee_components/Header'
import Sidebar from '../../components/employee_components/Sidebar'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Loader from '../../components/loader/Loader';


function AttendancePage() {
  const [attendanceUpdated, setAttendanceUpdated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const datePickerProps = {
    dateFormat: "yyyy-MM-dd",
    selected: selectedDate,
    onChange: date => setSelectedDate(date)
  };

  const handleAttendanceUpdate = () => {
    setAttendanceUpdated(!attendanceUpdated);
  };


  return (
    <>
      <Sidebar />
      <Header />
      <Loader />
      <div className='container'>
        <div className='row  d-flex align-items-center justify-content-center'>
          <div className='col-md-8 text-center'>
            <div className='row d-flex align-items-right justify-content-end'>
              <div className='col-md-3  text-right'>
                <Button variant="primary">Request Attendance</Button>{' '}
              </div>
            </div>
            <MarkAttendance handleAttendanceUpdate={handleAttendanceUpdate} selectedDate={selectedDate}/>
            <div className="row my-3 align-items-center justify-content-center">
              <div className="col-md-4">
                <DatePicker
                  {...datePickerProps}
                  className="form-control w-100"
                  placeholderText="Select a date"
                />
              </div>
            </div>
          </div>
          <div className='col-md-4 my-3'>
            <AttendanceLog attendanceUpdated={attendanceUpdated} selectedDate={selectedDate} />
          </div>
          <div className='col-md-12 text-center'>
            <AttendanceTable attendanceUpdated={attendanceUpdated} selectedDate={selectedDate} />
          </div>
        </div>
      </div>

    </>
  )
}

export default AttendancePage
