import { configureStore } from '@reduxjs/toolkit'
import authSlice from './AuthSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'


export const store = configureStore({
    reducer: {
        auth: authSlice
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch: () => AppDispatch = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


