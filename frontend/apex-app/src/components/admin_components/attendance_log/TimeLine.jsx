import React from 'react'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { red ,green } from '@mui/material/colors';
import { useEffect } from 'react';
import useAxios from '../../../utilis/useAxios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';


function TimeLine({date, setTotalHour}) {
    let api = useAxios()
    const params = useParams();

    const [attendanceLogs, setAttendanceLog] = useState([]);

    useEffect(() => {
    
        async function fetchData() {
            try {
                const select_date =  date ? moment(date).format('YYYY-MM-DD') :  moment(new Date()).format('YYYY-MM-DD')
                const response = await api.get(`attendance/log?&date=${select_date}&employee=${params?.id}`);

                if (response.status === 200) {
                    if (response.data.message){
                        setAttendanceLog([]);
                    }else{
                        setAttendanceLog(response.data.log);
                        setTotalHour(response.data.total_hours)
                        console.log(response.data.total_hours)
                    }
                }
            } catch (error) {
                console.error(error.message);
            }
        }
    
        fetchData();
    }, [date]);
    
  return (
    <>
        <Timeline position="alternate">
            {attendanceLogs?.map((attendanceLog, index) =>(
                <>
                    {attendanceLog?.is_check_in ? 
                            <TimelineItem>
                                <TimelineOppositeContent color="text.secondary">
                                    {moment(attendanceLog.time, 'HH:mm:ss').format('h:mm A')}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot  style={{ backgroundColor: green[900] }}/>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent> Logged In</TimelineContent>
                            </TimelineItem>
                        :

                        <TimelineItem>
                            <TimelineOppositeContent color="text.secondary">
                                {moment(attendanceLog.time, 'HH:mm:ss').format('h:mm A')}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                            <TimelineDot  style={{ backgroundColor: red[500] }}/>
                            <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent> Logged Out</TimelineContent>
                        </TimelineItem>
                    }
                </>
            ))}
        </Timeline>
    </>
  )
}

export default TimeLine
