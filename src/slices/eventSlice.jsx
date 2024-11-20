import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    events: []
}

// Slice definition
const eventSlice = createSlice({
    name: 'event',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setEvents(state, action) {
            state.events = action.payload;
        },
    }
});

export const { setLoading, setEvents } = eventSlice.actions;
export default eventSlice.reducer;