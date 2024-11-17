import toast from "react-hot-toast"
import { setLoading } from "../../slices/announcementSlice";
import apiConnector from "../apiConnect";
import { announcementEndPoints } from "../apis";

const {
    CREATE_ANNOUNCEMENT_API,
    UPDATE_ANNOUNCEMENT_API,
    DELETE_ANNOUNCEMENT_API,
    ALL_ANNOUNCEMENTS_API
} = announcementEndPoints;

export const createAnnouncement = (data, token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_ANNOUNCEMENT_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE ANNOUNCEMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Announcement Created Successfully!');
        } catch (error) {
            // console.log("CREATE ANNOUNCEMENT API ERROR............", error.message);
            toast.error(error?.message || "Announcement Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateAnnouncement = (data, token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_ANNOUNCEMENT_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE ANNOUNCEMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Announcement Created Successfully!');
        } catch (error) {
            // console.log("CREATE ANNOUNCEMENT API ERROR............", error.message);
            toast.error(error?.message || "Announcement Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllAnnouncement = async (token, setAnnouncement) => {
    try {
        const response = await apiConnector("GET", ALL_ANNOUNCEMENTS_API, null,
            {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        );

        // console.log("ANNOUNCEMENTS API RESPONSE............", response);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        setAnnouncement(response?.data?.data)
    } catch (error) {
        console.log("ANNOUNCEMENTS API ERROR............", error.message);
        toast.error(error?.message || "Announcement Fetched Failed!");
    }
}