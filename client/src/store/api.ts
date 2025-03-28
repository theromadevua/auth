import axios from "axios";

let token = localStorage.getItem('token')

export const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${token}` 
    },
    withCredentials: true
});