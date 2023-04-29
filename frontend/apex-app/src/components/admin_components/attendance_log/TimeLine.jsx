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
import { useDispatch, useSelector } from 'react-redux';
import { selectAttendanceLog, setAttendanceLog } from '../../../redux-toolkit/attendanceLogSlice';

function TimeLine() {
    let api = useAxios()
    const params = useParams();
    const attendanceLogs = useSelector(selectAttendanceLog);


    const dispatch = useDispatch();

    useEffect(() => {
    
        async function fetchData() {
        try {
            
            const response = await api.get(`api/attendance/log?&attendance=${params?.id}`);

            if (response.status === 200) {
                // console.log(response.data)
                dispatch(setAttendanceLog({ log: response.data.log, total_hours: response.data.total_hours }));
            }
        } catch (error) {
            console.error(error.message);
        }
        }
    
        fetchData();
    }, []);
    
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
