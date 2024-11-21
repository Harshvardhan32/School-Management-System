import toast from "react-hot-toast";
import { resultEndPoints } from "../apis";
import { setLessons, setLoading } from "../../slices/lessonSlice";
import apiConnector from "../apiConnect";

const {
    CREATE_RESULT_API,
    UPDATE_RESULT_API,
    DELETE_RESULT_API,
    ALL_RESULTS_API
} = resultEndPoints;

export const createLesson = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_LESSON_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE LESSON API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Lesson Created Successfully!');
            setOpen(false);
        } catch (error) {
            // console.log("CREATE LESSON API ERROR............", error.message);
            toast.error(error?.message || "Lesson Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateClass = (data, token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", UPDATE_CLASS_API,
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

export const getAllResults = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading results...');
        try {
            // Construct query parameters based on whether we need all data or paginated data
            const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
            const url = `${ALL_RESULTS_API}${queryParams}`;

            // Make the API request
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            if (allData) {
                // Dispatch all results to the store (non-paginated data)
                dispatch(setResults(response.data.data));
            } else {
                // Dispatch paginated results to the store
                dispatch(setPaginatedResults({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                }));
            }

            toast.success('Results loaded successfully!');
        } catch (error) {
            console.log("ALL RESULTS API ERROR............", error.message);
            toast.error(error.message || 'Failed to load results.');
        } finally {
            toast.dismiss(toastId);
        }
    };
};