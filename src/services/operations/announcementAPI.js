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

export const getAllAnnouncement = async (token, setAnnouncement, page = 1, limit = 10, allData = false) => {
    try {
        // Construct the API query based on allData flag
        const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
        const url = `${ALL_ANNOUNCEMENTS_API}${queryParams}`;

        // Make the API request
        const response = await apiConnector("GET", url, null, {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        });

        // Check for success in the response
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        // Call the callback to set the announcements (paginated or all)
        setAnnouncement(response?.data?.data);

    } catch (error) {
        console.log("ANNOUNCEMENTS API ERROR............", error.message);
        toast.error(error?.message || "Failed to fetch announcements.");
    }
};