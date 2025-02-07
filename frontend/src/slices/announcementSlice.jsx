import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allAnnouncements: [],
};

const announcementSlice = createSlice({
    name: 'announcements',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAnnouncements(state, action) {
            state.allAnnouncements = action.payload;
        }
    },
});

export const { setLoading, setAnnouncements } = announcementSlice.actions;
export default announcementSlice.reducer;