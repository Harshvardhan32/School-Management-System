import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allResults: [],
    resultDetails: null
};

const resultSlice = createSlice({
    name: 'result',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setResultDetails(state, action) {
            state.resultDetails = action.payload
        },
        setResults(state, action) {
            state.allResults = action.payload;
        }
    },
});

export const { setLoading, setResultDetails, setResults } = resultSlice.actions;
export default resultSlice.reducer;