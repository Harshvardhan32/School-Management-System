import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allAssignments: []
};

const assignmentSlice = createSlice({
    name: 'assignments',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAssignments(state, action) {
            state.allAssignments = action.payload;
        }
    },
});

export const { setLoading, setAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;