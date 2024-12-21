import toast from "react-hot-toast"
import apiConnector from "../apiConnect";
import { announcementEndPoints } from "../apis";
import { setLoading, setAnnouncements } from "../../slices/announcementSlice";

const {
    CREATE_ANNOUNCEMENT_API,
    UPDATE_ANNOUNCEMENT_API,
    DELETE_ANNOUNCEMENT_API,
    ALL_ANNOUNCEMENTS_API
} = announcementEndPoints;

export const createAnnouncement = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_ANNOUNCEMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("CREATE ANNOUNCEMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Announcement Created Successfully!');
            dispatch(getAllAnnouncement(token));
            setOpen(false);
        } catch (error) {
            console.log("CREATE ANNOUNCEMENT API ERROR............", error.message);
            toast.error(error?.message || "Announcement Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateAnnouncement = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_ANNOUNCEMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("UPDATE ANNOUNCEMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Announcement Updated Successfully!');
            dispatch(getAllAnnouncement(token));
            setOpen(false);
        } catch (error) {
            console.log("UPDATE ANNOUNCEMENT API ERROR............", error.message);
            toast.error(error?.message || "Announcement Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteAnnouncement = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_ANNOUNCEMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("DELETE ANNOUNCEMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Announcement Deleted Successfully!');
            dispatch(getAllAnnouncement(token));
            setOpen(false);
        } catch (error) {
            console.log("DELETE ANNOUNCEMENT API ERROR............", error.message);
            toast.error(error?.message || "Announcement Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllAnnouncement = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_ANNOUNCEMENTS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch announcements.");
            }

            dispatch(setAnnouncements(response?.data?.data));

            toast.success('Announcements loaded successfully!');
        } catch (error) {
            console.log("ALL ANNOUNCEMENTS API ERROR............", error.message);
            toast.error(error.message || 'Failed to load announcements.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // Set loading to false
        }
    };
};