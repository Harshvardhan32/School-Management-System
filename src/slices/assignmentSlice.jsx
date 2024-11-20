import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    assignments: []
}

// Slice definition
const assignmentSlice = createSlice({
    name: 'assignment',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAssignments(state, action) {
            state.assignments = action.payload;
        },
    }
});

export const { setLoading, setAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;