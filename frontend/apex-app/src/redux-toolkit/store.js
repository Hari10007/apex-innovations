import {combineReducers, configureStore} from  '@reduxjs/toolkit'
import userSlice from './userSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import messageSlice from './messageSlice';
import loaderSlice from './loaderSlice';

const persistConfig = {
    key: "root",
    version: 1,
    storage,
}

const reducer = combineReducers({
    user: userSlice,
    message: messageSlice,
    loader: loaderSlice,
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
    reducer: persistedReducer
})

export default store;
