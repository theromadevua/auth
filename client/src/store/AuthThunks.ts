import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

interface AuthCredentials {
    email: string;
    password: string;
}

interface ApiResponse<T> {
    data: T;
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ password, email }: AuthCredentials, { rejectWithValue }): Promise<any> => {
        try {
            const response: ApiResponse<any> = await api.post(
                `${process.env.REACT_APP_API_URL}/auth/registration`,
                { password, email }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ password, email }: AuthCredentials, { rejectWithValue }): Promise<any> => {
        try {
            const response: ApiResponse<any> = await api.post(
                `${process.env.REACT_APP_API_URL}/auth/login`,
                { password, email }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const refresh = createAsyncThunk(
    'auth/refresh',
    async (_, { rejectWithValue }): Promise<any> => {
        try {
            const response: ApiResponse<any> = await api.get(
                `${process.env.REACT_APP_API_URL}/auth/refresh`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }): Promise<any> => {
        try {
            await api.delete(`${process.env.REACT_APP_API_URL}/auth/logout`);
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({password, token}: {password: string, token: string}, { rejectWithValue }): Promise<any> => {
        try {
            await api.patch(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {password, token});
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const resetPasswordRequest = createAsyncThunk(
    'auth/resetPasswordRequest',
    async (email: string, { rejectWithValue }): Promise<any> => {
        try {
            await api.get(`${process.env.REACT_APP_API_URL}/auth/reset-password-request?email=${email}`);
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);