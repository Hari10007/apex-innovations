import React from 'react'
import { Outlet } from 'react-router-dom'
import AlertMessage from '../../../components/alert/Alert'

function SalaryDetails() {
  return (
    <>
      <AlertMessage />
      <Outlet />
    </>
  )
}

export default SalaryDetails
