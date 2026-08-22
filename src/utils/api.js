import axios from "axios";

import { getToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

const api = axios.create(
    {
        baseURL: API_BASE_URL,
    }
)

// Run before every Request, Make sure vendor is loged in.

api.interceptors.request.use(
    (config)=>{
        const token = getToken();

        if(token) config.headers.token = token;
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

// Handling responses
api.interceptors.response.use(
    (response)=> response,
    (error)=>{
        if(error.response?.status === 401){
            console.log("Unauthorized - token may be expired");
        }
        return Promise.reject(error);
    }
)

// get only response data;

export const unwrap = (response)=>{
    return response?.data;// it will return oly data from the
}

// get a Error message for backend.

export const getErrorMessage =(error)=> error?.response?.data?.message || error?.response?.data?.error || error?.message || error?.error || "Some thing went wrong."

export default  api;