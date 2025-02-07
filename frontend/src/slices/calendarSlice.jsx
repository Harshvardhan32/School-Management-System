import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    allCalendars: []
};

const calendareSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setAllCalendars(state, action) {
            state.allCalendars = action.payload;
        }
    },
});

export const { setLoading, setAllCalendars } = calendareSlice.actions;
export default calendareSlice.reducer;