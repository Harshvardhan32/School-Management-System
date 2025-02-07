import { createSlice } from "@reduxjs/toolkit"

const initiateState = {
    loading: false,
    token: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth'))?.token : null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initiateState,
    reducers: {
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload;
        },
    }
});

export const { setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;