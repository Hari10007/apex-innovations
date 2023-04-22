import React from 'react'
import { useEffect } from 'react';
import { Table } from 'react-bootstrap'
import useAxios from '../../../utilis/useAxios';
import { useState } from 'react';
import moment from 'moment';
import HolidayUpdateModal from './HolidayUpdateModal';
import HolidayDelete from './HolidayDelete';

function HolidayTable({handle_holiday, holidayUpdated}) {
    const [holidays, setHolidays] = useState([]);
    const [holiday, setHoliday] = useState([]);
    const[modalShow, setModalShow] = useState(false);
    const [open, setOpen] = useState(false);

    const api = useAxios();

    useEffect(() => {
        async function fetchData() {
        const currentYear = new Date().getFullYear();

        const response = await api.get(
            `api/holiday/list?&year=${currentYear}`
        );

        if (response.status === 200) {
            setHolidays(response.data);
        }
        }
        fetchData();
    }, [holidayUpdated]);


    const isPastDate = (date) =>{
        const today = moment();
        const holidayDate = moment(date);
        return holidayDate.isBefore(today, 'day');
    }

    const handleHoliday = (holiday)=>{
        setHoliday(holiday)
        setModalShow(true)
    }

    const dialogHoliday = (holiday)=>{
      setHoliday(holiday)
      setOpen(true);
    }

    const handleClose = () => {
      setOpen(false);
    };

  return (
    <>
      <Table>
        <thead style={{ backgroundColor: '#2b889b', color: '#ffffff' }}>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
            <th colSpan={2}>Action</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday, index) => (
            <tr key={index} className={isPastDate(holiday.date) ? 'text-muted' : ''}>
              <td>{index + 1}</td>
              <td>{holiday.name}</td>
              <td>{holiday.date}</td>
              <td><i className="fas fa-edit" style={{ cursor: 'pointer' }}  onClick={() => handleHoliday(holiday)}></i></td>
              <td><i className="fas fa-trash" style={{ cursor: 'pointer' }} onClick={() => dialogHoliday(holiday)}></i></td>
            </tr>

          ))}
        </tbody>
        <HolidayDelete handle_holiday={handle_holiday}  holiday={holiday} open={open} onClose={() => handleClose()}/>
        <HolidayUpdateModal handle_holiday={handle_holiday}  holiday={holiday} show={modalShow} onHide={() => setModalShow(false)}/>
      </Table>
    </>
  )
}

export default HolidayTable
