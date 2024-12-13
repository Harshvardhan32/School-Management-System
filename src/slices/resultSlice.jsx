import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allResults: [],
};

const resultSlice = createSlice({
    name: 'result',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setResults(state, action) {
            state.allResults = action.payload;
        }
    },
});

export const { setLoading, setResults } = resultSlice.actions;
export default resultSlice.reducer;