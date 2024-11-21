import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    paginatedSubjects: [],  // For paginated display
    allSubjects: [],        // For forms (non-paginated)
    totalPages: 0,          // Total pages for paginated data
    currentPage: 1,         // Current page for paginated data
};

// Slice definition
const subjectSlice = createSlice({
    name: 'subject',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setPaginatedSubjects(state, action) {
            state.paginatedSubjects = action.payload.data; // Store paginated subjects
            state.totalPages = action.payload.totalPages; // Store total number of pages
            state.currentPage = action.payload.currentPage; // Store current page
        },
        setAllSubjects(state, action) {
            state.allSubjects = action.payload; // Store all subjects for non-paginated view
        },
    }
});

export const { setLoading, setPaginatedSubjects, setAllSubjects } = subjectSlice.actions;
export default subjectSlice.reducer;