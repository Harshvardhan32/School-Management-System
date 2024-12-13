import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth"))?.user : null,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        }
    }
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;