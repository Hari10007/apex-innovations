import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    pageLoader: false,
    notificationLoader: false

}


const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers:{
        startPageLoader: (state) => {
            state.pageLoader = true;
        },
        stopPageLoader: (state) => {
            state.pageLoader = false;
        },
        startNotificationLoader: (state) =>{
            state.notificationLoader = true;
        },
        stopNotificationLoader: (state) => {
            state.notificationLoader = false;
        },

    }
})


export const{
    startPageLoader, stopPageLoader, startNotificationLoader, stopNotificationLoader
} = loaderSlice.actions;


export const selectPageLoader = (state) => state.loader.pageLoader;
export const selectNotificationLoader = (state) => state.loader.notificationLoader;
export default loaderSlice.reducer;
