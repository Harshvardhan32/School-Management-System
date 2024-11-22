import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    loading: false,
    paginatedEvents: [],
    allEvents: [],
    totalPages: 0,
    currentPage: 1,
}

// Slice definition
const eventSlice = createSlice({
    name: 'event',
    initialState: initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setPaginatedEvents(state, action) {
            state.paginatedEvents = action.payload.data;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
        setAllEvents(state, action) {
            state.allEvents = action.payload;
        }
    }
});

export const { setLoading, setPaginatedEvents, setAllEvents } = eventSlice.actions;
export default eventSlice.reducer;