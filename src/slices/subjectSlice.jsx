import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    allSubjects: []
};

// Slice definition
const subjectSlice = createSlice({
    name: 'subject',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAllSubjects(state, action) {
            state.allSubjects = action.payload;
        },
    }
});

export const { setLoading, setAllSubjects } = subjectSlice.actions;
export default subjectSlice.reducer;