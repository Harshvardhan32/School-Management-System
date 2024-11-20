import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    exams: []
}

// Slice definition
const examSlice = createSlice({
    name: 'exam',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setExams(state, action) {
            state.exams = action.payload;
        },
    }
});

export const { setLoading, setExams } = examSlice.actions;
export default examSlice.reducer;