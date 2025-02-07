import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allExams: [],
};

const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setExams(state, action) {
            state.allExams = action.payload;
        }
    },
});

export const { setLoading, setExams } = examSlice.actions;
export default examSlice.reducer;