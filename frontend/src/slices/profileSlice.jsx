import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth"))?.user : null,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
            let userData = JSON.parse(localStorage.getItem("auth"));
            if (userData) {
                userData.user = value.payload;
                localStorage.setItem('auth', JSON.stringify(userData));
            }
        },
        setProfilePicture(state, value) {
            state.user.userId.photo = value.payload;
            let userData = JSON.parse(localStorage.getItem("auth"));
            userData.user.userId.photo = value.payload;
            localStorage.setItem('auth', JSON.stringify(userData));
        }
    }
});

export const { setUser, setProfilePicture } = profileSlice.actions;
export default profileSlice.reducer;