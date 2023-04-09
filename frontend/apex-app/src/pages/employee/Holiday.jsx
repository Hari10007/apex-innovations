import React, { useState } from 'react'
import Header from '../../components/employee_components/Header'
import Sidebar from '../../components/employee_components/Sidebar'
import HolidayList from '../../components/employee_components/holiday/HolidayList';
import Loader from '../../components/loader/Loader';

function HolidayPage() {
  const [holidayUpdated, setHolidayUpdated] = useState(false);

  const handleHolidayUpdate = () => {
    setHolidayUpdated(!holidayUpdated);
  };

  return (
  <>
      <Sidebar />
      <Header/>
      <Loader />
      <div className='container'>
        <HolidayList handleHolidayUpdate={handleHolidayUpdate}/>
      </div>

  </>
  )
}

export default HolidayPage
