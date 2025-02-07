import toast from 'react-hot-toast';
import { eventEndPoints } from '../apis';
import apiConnector from '../apiConnect';
import { setLoading, setAllEvents } from '../../slices/eventSlice';

const {
    CREATE_EVENT_API,
    UPDATE_EVENT_API,
    DELETE_EVENT_API,
    ALL_EVENTS_API
} = eventEndPoints;

export const createEvent = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Event...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_EVENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Event Created Successfully!');
            dispatch(getAllEvents(token));
            setOpen(false);
        } catch (error) {
            toast.error("Event Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateEvent = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Event...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_EVENT_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Event Updated Successfully!');
            dispatch(getAllEvents(token));
            setOpen(false);
        } catch (error) {
            toast.error("Event Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteEvent = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Event...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_EVENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Event Deleted Successfully!');
            dispatch(getAllEvents(token));
            setOpen(false);
        } catch (error) {
            toast.error("Event Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllEvents = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_EVENTS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch events.");
            }

            dispatch(setAllEvents(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}