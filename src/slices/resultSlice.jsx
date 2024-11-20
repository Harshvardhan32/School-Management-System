import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    results: []
}

const resultSlice = createSlice({
    name: 'result',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setResults(state, action) {
            state.results = action.payload;
        },
    }
});

export const { setLoading, setResults } = resultSlice.actions;
export default resultSlice.reducer;