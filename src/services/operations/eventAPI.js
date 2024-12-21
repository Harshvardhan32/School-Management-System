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
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_EVENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("CREATE EVENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Event Created Successfully!');
            dispatch(getAllEvents(token));
            setOpen(false);
        } catch (error) {
            console.log("CREATE EVENT API ERROR............", error.message);
            toast.error(error?.message || "Event Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateEvent = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_EVENT_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("UPDATE EVENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Event Updated Successfully!');
            dispatch(getAllEvents(token));
            setOpen(false);
        } catch (error) {
            console.log("UPDATE EVENT API ERROR............", error.message);
            toast.error(error?.message || "Event Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteEvent = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_EVENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("DELETE EVENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Event Deleted Successfully!');
            dispatch(getAllEvents(token));
            setOpen(false);
        } catch (error) {
            console.log("DELETE EVENT API ERROR............", error.message);
            toast.error(error?.message || "Event Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllEvents = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true)); // Set loading to true
        const toastId = toast.loading('Loading...');

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_EVENTS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch subjects.");
            }

            dispatch(setAllEvents(response?.data?.data));

            toast.success('Events loaded successfully!');
        } catch (error) {
            console.error("Error fetching subjects:", error.message);
            toast.error(error.message || 'Failed to load subjects.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // Set loading to false
        }
    };
}