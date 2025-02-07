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
        const toastId = toast.loading('Creating Announcement...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_ANNOUNCEMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Announcement Created Successfully!');
            dispatch(getAllAnnouncement(token));
            setOpen(false);
        } catch (error) {
            toast.error("Announcement Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateAnnouncement = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Announcement...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_ANNOUNCEMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Announcement Updated Successfully!');
            dispatch(getAllAnnouncement(token));
            setOpen(false);
        } catch (error) {
            toast.error("Announcement Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteAnnouncement = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Announcement...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_ANNOUNCEMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Announcement Deleted Successfully!');
            dispatch(getAllAnnouncement(token));
            setOpen(false);
        } catch (error) {
            toast.error("Announcement Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllAnnouncement = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

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
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
}