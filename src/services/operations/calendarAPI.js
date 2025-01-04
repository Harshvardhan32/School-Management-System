import toast from "react-hot-toast";
import { calendarEndPoints } from "../apis";
import { setLoading, setAllCalendars } from "../../slices/calendarSlice";
import apiConnector from "../apiConnect";

const {
    CREATE_CALENDAR_API,
    UPDATE_CALENDAR_API,
    ALL_CALENDARS_API
} = calendarEndPoints;

export const createCalendar = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_CALENDAR_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE CLASS API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Class Created Successfully!');
            dispatch(getAllCalendars(token));
            setOpen(false);
        } catch (error) {
            // console.log("CREATE CLASS API ERROR............", error.message);
            toast.error("Class Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateCalendar = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_CALENDAR_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("UPDATE CLASS API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Class Updated Successfully!');
            dispatch(getAllCalendars(token));
            setOpen(false);
        } catch (error) {
            // console.log("UPDATE CLASS API ERROR............", error.message);
            toast.error("Class Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllCalendars = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("GET", ALL_CALENDARS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            dispatch(setAllCalendars(response?.data?.data));
            // toast.success('Calendar loaded successfully!');
        } catch (error) {
            console.error("Error fetching calendar:", error.message);
            toast.error('Failed to load calendar.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
}