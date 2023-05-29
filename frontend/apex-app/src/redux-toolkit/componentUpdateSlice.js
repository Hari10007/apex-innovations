import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    value : false
}

const componentUpdateSlice = createSlice({
    name: 'component_update',
    initialState,
    reducers: {
        toggleValue: (state) => {
            state.value = !state.value;
        }
    }
});

export const { toggleValue } = componentUpdateSlice.actions;

export const selectedValue = (state) => state.component_update.value;

export default componentUpdateSlice.reducer;




