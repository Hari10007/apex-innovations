import React from 'react'
import { Box } from '@mui/material';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectTotalHours } from '../../../redux-toolkit/attendanceLogSlice';

function AttendanceHourBox() {
    const hours = useSelector(selectTotalHours);
    const duration = moment.duration(hours, 'seconds');
    const formattedDuration = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
  
  return (
    <>
      <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItem: 'center',
            width: 400,
            height: 100,
            backgroundColor: 'success.dark',
            color: 'white',
            borderRadius: 5,
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
            '&:hover': {
                backgroundColor: 'warning.main',
                opacity: [0.9, 0.8, 0.7],
                color: 'white'
            },
        }}
        >
           <div className='d-flex flex-column align-items-center my-3'>
                <h6>Hours</h6>
                <p style={{fontSize: '1.5rem'}}> {formattedDuration}</p>
            </div>
        </Box>
    </>
  )
}

export default AttendanceHourBox
