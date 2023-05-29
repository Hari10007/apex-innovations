import React from 'react'
import { Outlet } from 'react-router-dom'
import AlertMessage from '../../../components/alert/Alert'

function AttendanceDetail() {
  return (
    <>
      <AlertMessage />
      <Outlet />
    </>
  )
}

export default AttendanceDetail
