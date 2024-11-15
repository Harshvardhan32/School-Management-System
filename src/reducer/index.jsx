import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";

const rootStore = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer
    }
});

export default rootStore;