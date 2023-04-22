import React from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import HolidayModal from './HolidayModal';

function HolidayButton({handle_holiday}) {
    const[modalShow, setModalShow] = useState(false);

  return (
    <>
        <div className='row my-4 d-flex align-items-center justify-content-end'>
            <div className='col-md-3'>
                <Button variant="primary" onClick={() => setModalShow(true)}>
                    <i className="fa-solid fa-plus"></i> Create Holiday
                </Button>
          
                <HolidayModal handle_holiday={handle_holiday}  show={modalShow} onHide={() => setModalShow(false)}/>
            </div>
        </div>
    </>
  )
}

export default HolidayButton
