import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import useAxios from '../../../utilis/useAxios';
import moment from 'moment';

function HolidayList({ holidayUpdated }) {

  const [holidays, setHolidays] = useState([]);

  const api = useAxios();

  useEffect(() => {
    async function fetchData() {
      const currentYear = new Date().getFullYear();

      const response = await api.get(
        `holiday/list?&year=${currentYear}`
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

  return (
      <Table>
        <thead style={{ backgroundColor: '#2b889b', color: '#ffffff' }}>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday, index) => (
            <tr key={index} className={isPastDate(holiday.date) ? 'text-muted' : ''}>
              <td>{index + 1}</td>
              <td>{holiday.name}</td>
              <td>{holiday.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
  );
}

export default HolidayList;
