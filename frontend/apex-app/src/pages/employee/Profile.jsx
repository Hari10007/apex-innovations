import React, { useState } from 'react'
import Header from '../../components/employee_components/Header'
import Sidebar from '../../components/employee_components/Sidebar'
import EmployeeDetail from '../../components/employee_components/profile/EmployeeDetail';
import Loader from '../../components/loader/Loader';
import AlertMessage from '../../components/alert/Alert';



function ProfilePage() {
  const [profileUpdated, setProfileUpdated] = useState(false);

  const handleHProfileUpdate = () => {
    setProfileUpdated(!profileUpdated);
  };


  return (
    <>
      <Sidebar />
      <Header/>
      <Loader />
      <div className='container'>
        <AlertMessage/>
        <EmployeeDetail handleProfileUpdate={handleHProfileUpdate}/>
      </div>

    </>
  )
}

export default ProfilePage
