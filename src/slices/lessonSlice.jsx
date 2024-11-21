import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    paginatedLessons: [],  // For paginated lessons
    allLessons: [],        // For all lessons (non-paginated)
    totalPages: 0,         // Total pages for paginated data
    currentPage: 1,        // Current page for paginated data
};

// Slice definition
const lessonSlice = createSlice({
    name: 'lesson',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setPaginatedLessons(state, action) {
            state.paginatedLessons = action.payload.data; // Store paginated lessons
            state.totalPages = action.payload.totalPages; // Store total pages for pagination
            state.currentPage = action.payload.currentPage; // Store the current page
        },
        setAllLessons(state, action) {
            state.allLessons = action.payload; // Store all lessons for non-paginated view
        },
    }
});

export const { setLoading, setPaginatedLessons, setAllLessons } = lessonSlice.actions;
export default lessonSlice.reducer;