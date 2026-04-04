import { configureStore } from "@reduxjs/toolkit";
import authReducer from './apiHandler/authApiHandler/authSlice';
import appointmentReducer from './apiHandler/authApiHandler/appointmentSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        appointments: appointmentReducer,
    }
})