import axios from 'axios'
import jwt_decode from "jwt-decode";
// import dayjs from 'dayjs'
import { useDispatch } from 'react-redux';
import { logout, startLoading, stopLoading, updateUser } from '../redux-toolkit/userSlice';
import Cookies from 'js-cookie';


const baseURL = 'http://localhost:8000/'

const useAxios = () => {
    const dispatch = useDispatch('')

    let access_token = Cookies.get('access_token') ? Cookies.get('access_token') : null
    let refresh_token = Cookies.get('refresh_token') ? Cookies.get('refresh_token') : null

    if (refresh_token === null) dispatch(logout());

    const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${access_token}` }
    });

    let requestCount = 0;
    let responseCount = 0;


    axiosInstance.interceptors.request.use(async req => {

        dispatch(startLoading());
        requestCount++;

        if (access_token === null) {
            const response = await axios.post(`${baseURL}/api/refresh-token/`, {
                refresh: refresh_token
            });

            const decode_token = jwt_decode(response.data.access)

            dispatch(updateUser(decode_token));

            req.headers.Authorization = `Bearer ${response.data.access}`

            const ACCESS_TOKEN_LIFETIME = 1; //hour
            const accessTokenExpires = new Date(Date.now() + ACCESS_TOKEN_LIFETIME * 60 * 60 * 1000);

            Cookies.set('access_token', response.data.access, { expires: accessTokenExpires });
        }
        
        return req;
        
    });
    
    axiosInstance.interceptors.response.use(
        (response) => {
            responseCount++;
            if (requestCount === responseCount) {
                dispatch(stopLoading()); 
            }
            return response;
        },
        (error) => {
          responseCount++;
          if (requestCount === responseCount) {
            dispatch(stopLoading());
          }
          return Promise.reject(error);
        }
    );


    return axiosInstance
}

export default useAxios;
