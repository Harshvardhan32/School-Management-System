import toast from "react-hot-toast";
import { setLoading, setTeachers, setPaginatedTeachers } from "../../slices/teacherSlice";
import { teacherEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    ALL_TEACHERS_API
} = teacherEndPoints;

export const getAllTeachers = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        dispatch(setLoading(true)); // Start loading
        const toastId = toast.loading('Loading teachers...');
        try {
            // Construct the query parameters for either all data or paginated data
            const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
            const url = `${ALL_TEACHERS_API}${queryParams}`;

            // Make the API request
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch teachers.");
            }

            if (allData) {
                // Dispatch non-paginated data to the store
                dispatch(setTeachers(response.data.data));
            } else {
                // Dispatch paginated data to the store
                dispatch(setPaginatedTeachers({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                }));
            }

            toast.success('Teachers loaded successfully!');
        } catch (error) {
            console.log("ALL TEACHERS API ERROR............", error.message);
            toast.error(error.message || 'Failed to load teachers.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // End loading
        }
    };
};