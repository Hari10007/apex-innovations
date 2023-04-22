import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const initialState = {
    user: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        login: (state,action)=>{
            state.user = action.payload;
        },
        updateUser: (state,action)=>{
            state.user = action.payload;
        },
        updateUserDetails: (state,action)=>{
            state.user.image = action.payload;
        },
        logout:(state)=>{
            state.user = null
            Cookies.remove('refresh_token');
            Cookies.remove('access_token');
        }
    }
})


export const{
    login , updateUser , updateUserDetails, logout
} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export default userSlice.reducer;
