import React, { useState } from 'react'
import Header from '../../components/employee_components/Header'
import Sidebar from '../../components/employee_components/Sidebar'
import HolidayList from '../../components/employee_components/holiday/HolidayList';
import Loader from '../../components/loader/Loader';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux-toolkit/userSlice';
import AlertMessage from '../../components/alert/Alert';
import HolidayButton from '../../components/admin_components/holiday/HolidayButton';
import HolidayTable from '../../components/admin_components/holiday/HolidayTable';

function HolidayPage() {
  const employee = useSelector(selectUser);
  const [holidayUpdated, setHolidayUpdated] = useState(false);

  const handle_holiday = () => {
    setHolidayUpdated(!holidayUpdated);
  };

  return (
    <>
        <Sidebar />
        <Header/>
        <Loader />
        <div className='container'>  
          {employee?.admin ? 
            <>
                <AlertMessage />
                <HolidayButton handle_holiday={handle_holiday}/>
                <HolidayTable handle_holiday={handle_holiday} holidayUpdated={holidayUpdated}/>
            </> :
            <>
              <HolidayList handle_holiday={handle_holiday}/>
            </> }
        </div>
    </>
  )
}

export default HolidayPage
