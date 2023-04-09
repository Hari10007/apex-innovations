import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: '',
    messageType: ''
}

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers:{
        setMessage: (state, action) => {
            state.message = action.payload.message;
            state.messageType = action.payload.type;
        },
        clearMessage: (state) => {
            state.message = "";
            state.messageType = "";
        },
    }
})

export const{ setMessage, clearMessage } = messageSlice.actions;

export const selectMessage = (state) => state.message.message;
export const selectMessageType = (state) => state.message.messageType;

export default messageSlice.reducer;