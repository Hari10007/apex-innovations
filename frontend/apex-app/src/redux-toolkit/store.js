import {combineReducers, configureStore} from  '@reduxjs/toolkit'
import userSlice from './userSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import messageSlice from './messageSlice';
import loaderSlice from './loaderSlice';
import attendanceLogSlice from './attendanceLogSlice';
import adminSalarySlice from './adminSalarySlice';

const persistConfig = {
    key: "root",
    version: 1,
    storage,
}

const reducer = combineReducers({
    user: userSlice,
    message: messageSlice,
    loader: loaderSlice,
    attendance_log: attendanceLogSlice,
    admin_salary: adminSalarySlice,
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: persistedReducer
})

export default store;
