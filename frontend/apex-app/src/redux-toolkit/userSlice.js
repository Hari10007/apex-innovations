import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const initialState = {
    user: null,
    loading: false
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
        logout:(state)=>{
            state.user = null
            Cookies.remove('refresh_token');
            Cookies.remove('access_token');
        },
        startLoading: (state) => {
            state.loading = true;
        },
        stopLoading: (state) => {
            state.loading = false;
        }
    }
})


export const{
    login, updateUser, logout, startLoading, stopLoading
} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectLoading = (state) => state.user.loading;
export default userSlice.reducer;
