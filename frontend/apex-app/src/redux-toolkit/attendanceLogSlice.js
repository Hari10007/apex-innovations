import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    attendanceLog: '',
    hours: ''
}

const attendanceLogSlice = createSlice({
    name: "attendance_log",
    initialState,
    reducers:{
        setAttendanceLog: (state, action) => {
            state.attendanceLog = action.payload.log;
            state.hours = action.payload.total_hours;
        }
    }
})

export const{ setAttendanceLog } = attendanceLogSlice.actions;

export const selectAttendanceLog= (state) => state.attendance_log.attendanceLog;
export const selectTotalHours = (state) => state.attendance_log.hours;

export default attendanceLogSlice.reducer;