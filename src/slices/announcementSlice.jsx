import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    announcements: [],
}

const announcementSlice = createSlice({
    name: 'announcment',
    initialState: initialState,
    reducers: {
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setAnnouncement(state, value) {
            state.announcements = value.payload;
        }
    }
});

export const { setLoading, setAnnouncement } = announcementSlice.actions;
export default announcementSlice.reducer;