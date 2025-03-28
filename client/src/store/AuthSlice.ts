import { createSlice } from '@reduxjs/toolkit'
import { loginUser, logoutUser, refresh, registerUser } from './AuthThunks'

const initialState = {
    user: {},
    isAuth: false,
    isLoading: false
}

export const authSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
        .addCase(registerUser.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.user = action.payload?.user
            localStorage.setItem('token', action.payload?.accessToken)
            state.isAuth = true
            state.isLoading = false
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isAuth = false
            state.isLoading = false
        })
        .addCase(refresh.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(refresh.fulfilled, (state, action) => {
            state.user = action.payload?.user
            state.isAuth = true
            state.isLoading = false
        })
        .addCase(refresh.rejected, (state, action) => {
            state.isAuth = false
            state.isLoading = false
        })
        .addCase(loginUser.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            console.log(action.payload)
            state.user = action.payload?.user
            localStorage.setItem('token', action.payload?.accessToken)
            state.isAuth = true
            state.isLoading = false
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isAuth = false
            state.isLoading = false
        })
        .addCase(logoutUser.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(logoutUser.fulfilled, (state, action) => {
            state.user = {}
            state.isAuth = false
            state.isLoading = false
        })
        .addCase(logoutUser.rejected, (state, action) => {
            state.isLoading = false
        })
  }
})

export const {  } = authSlice.actions

export default authSlice.reducer