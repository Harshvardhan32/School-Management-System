import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { calendarEndPoints } from "../apis";
import { setLoading, setAllCalendars } from "../../slices/calendarSlice";

const {
    CREATE_CALENDAR_API,
    UPDATE_CALENDAR_API,
    DELETE_CALENDAR_API,
    ALL_CALENDARS_API
} = calendarEndPoints;

export const createCalendar = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Calendar...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_CALENDAR_API,
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
            toast.success('Class Created Successfully!');
            dispatch(getAllCalendars(token));
            setOpen(false);
        } catch (error) {
            toast.error("Class Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateCalendar = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Calendar...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_CALENDAR_API,
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
            toast.success('Class Updated Successfully!');
            dispatch(getAllCalendars(token));
            setOpen(false);
        } catch (error) {
            toast.error("Class Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteCalendar = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Calendar...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_CALENDAR_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Calendar Deleted Successfully!');
            dispatch(getAllCalendars(token));
            setOpen(false);
        } catch (error) {
            toast.error("Calendar Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllCalendars = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", ALL_CALENDARS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || 'Something went wrong!');
            }

            dispatch(setAllCalendars(response?.data?.data));
        } catch (error) {
            // console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}