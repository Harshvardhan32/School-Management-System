import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    paginatedAttendance: [],
    allAttendance: [],
    totalPages: 0,
    currentPage: 1,
};

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAttendance(state, action) {
            state.allAttendance = action.payload; // Non-paginated attendance data
        },
        setPaginatedAttendance(state, action) {
            state.paginatedAttendance = action.payload.data; // Paginated attendance data
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
    },
});

export const { setLoading, setAttendance, setPaginatedAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;