import toast from 'react-hot-toast';
import { eventEndPoints } from '../apis';
import apiConnector from '../apiConnect';
import { setLoading } from '../../slices/eventSlice';

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
            const response = await apiConnector("POST", CREATE_EVENT_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE EVENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Event Created Successfully!');
            setOpen(false);
        } catch (error) {
            // console.log("CREATE EVENT API ERROR............", error.message);
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
            const response = await apiConnector("POST", UPDATE_EVENT_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE EVENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Event Created Successfully!');
            setOpen(false);
        } catch (error) {
            // console.log("CREATE EVENT API ERROR............", error.message);
            toast.error(error?.message || "Event Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}