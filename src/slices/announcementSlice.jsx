import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    announcements: [],          // For non-paginated data
    paginatedAnnouncements: [], // For paginated data
    totalPages: 0,
    currentPage: 1,
};

const announcementSlice = createSlice({
    name: 'announcements',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAnnouncements(state, action) {
            state.announcements = action.payload; // Non-paginated data
        },
        setPaginatedAnnouncements(state, action) {
            state.paginatedAnnouncements = action.payload.data; // Paginated data
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
    },
});

export const { setLoading, setAnnouncements, setPaginatedAnnouncements } = announcementSlice.actions;
export default announcementSlice.reducer;