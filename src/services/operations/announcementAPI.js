import toast from "react-hot-toast"
import { setLoading, setAnnouncements, setPaginatedAnnouncements } from "../../slices/announcementSlice";
import apiConnector from "../apiConnect";
import { announcementEndPoints } from "../apis";

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

export const getAllAnnouncement = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        dispatch(setLoading(true)); // Set loading to true
        const toastId = toast.loading('Loading announcements...');

        try {
            // Construct the query parameters for either all data or paginated data
            const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
            const url = `${ALL_ANNOUNCEMENTS_API}${queryParams}`;

            // Make the API request
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch announcements.");
            }

            if (allData) {
                // Dispatch non-paginated data to the store
                dispatch(setAnnouncements(response?.data?.data));
            } else {
                // Dispatch paginated data to the store
                dispatch(setPaginatedAnnouncements({
                    data: response?.data?.data,
                    totalPages: response?.data?.totalPages,
                    currentPage: response?.data?.currentPage,
                }));
            }

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