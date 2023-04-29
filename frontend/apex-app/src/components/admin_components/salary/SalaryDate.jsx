import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';

function SalaryDate({setDate}) {

  const [errorMessage, setErrorMessage] = useState('');

  const handleDate = (newValue)=> {
    if (newValue.isValid()) {
      setDate(newValue.format('MM YYYY'))
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid date selected');
    }
  }
  

  return (
    <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
                <DatePicker  
                  onChange={handleDate} 
                  views={['month', 'year']}
                  disableMaskedInput={true} />
            </DemoContainer>
        </LocalizationProvider>
        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
    </>
  )
}

export default SalaryDate
