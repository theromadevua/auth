import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

let token = localStorage.getItem('token')

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${token}` 
    },
    withCredentials: true
  });

const initialState = {
    user: {},
    isAuth: false
}

export const registerUser = createAsyncThunk('auth/register', async ({password, email}) => {
    const response = await api.post(`${process.env.REACT_APP_API_URL}/auth/registration`, {password, email})
    console.log(response)
    return await response.data
})

export const loginUser = createAsyncThunk('auth/login', async ({password, email}) => {
    const response = await api.post(`${process.env.REACT_APP_API_URL}/auth/login`, {password, email})
    return await response.data
})

export const refresh = createAsyncThunk('auth/refresh', async () => {
    const response = await api.get(`${process.env.REACT_APP_API_URL}/auth/refresh`)
    return await response.data
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await api.delete(`${process.env.REACT_APP_API_URL}/auth/logout`)
    return true
})

export const authSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
        .addCase(registerUser.pending, (state, action) => {

        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.user = action.payload?.user
            localStorage.setItem('token', action.payload?.accessToken)
            state.isAuth = true
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isAuth = false
        })
        .addCase(refresh.pending, (state, action) => {

        })
        .addCase(refresh.fulfilled, (state, action) => {
            state.user = action.payload?.user
            state.isAuth = true
        })
        .addCase(refresh.rejected, (state, action) => {
            state.isAuth = false
        })
        .addCase(loginUser.pending, (state, action) => {

        })
        .addCase(loginUser.fulfilled, (state, action) => {
            console.log(action.payload)
            state.user = action.payload?.user
            localStorage.setItem('token', action.payload?.accessToken)
            state.isAuth = true
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isAuth = false
        })
        .addCase(logoutUser.pending, (state, action) => {

        })
        .addCase(logoutUser.fulfilled, (state, action) => {
            state.user = {}
            state.isAuth = false
        })
        .addCase(logoutUser.rejected, (state, action) => {

        })
  }
})

export const {  } = authSlice.actions

export default authSlice.reducer