import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allParents: []
};

const parentSlice = createSlice({
    name: 'parent',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setParents(state, action) {
            state.allParents = action.payload;
        }
    },
});

export const { setLoading, setParents } = parentSlice.actions;
export default parentSlice.reducer;