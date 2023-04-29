import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    date : ""
}

const adminSalarySlice = createSlice({
    name: 'admin_salary',
    initialState,
    reducers: {
        setDate: (state, action) => {
            console.log(action.payload)
            state.date = action.payload;
        }
    }

})

export const { setDate } = adminSalarySlice.actions;

export const selectedDate = (state) => state.admin_salary.date;

export default adminSalarySlice.reducer;

