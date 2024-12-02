import toast from "react-hot-toast";
import { setLoading, setExams, setPaginatedExams } from "../../slices/examSlice";
import { examEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    CREATE_EXAM_API,
    UPDATE_EXAM_API,
    DELETE_EXAM_API,
    ALL_EXAMS_API,
} = examEndPoints;

export const createExam = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_EXAM_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("CREATE EXAM API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Exam Created Successfully!');
            setOpen(false);
        } catch (error) {
            // console.log("CREATE EXAM API ERROR............", error.message);
            toast.error(error?.message || "Exam Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllExams = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        dispatch(setLoading(true)); // Set loading to true
        const toastId = toast.loading('Loading...');
        try {
            // Construct query parameters for either all data or paginated data
            const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
            const url = `${ALL_EXAMS_API}${queryParams}`;

            // Make the API request
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch exams.");
            }

            if (allData) {
                // Dispatch non-paginated data to the store
                dispatch(setExams(response.data.data));
            } else {
                // Dispatch paginated data to the store
                dispatch(setPaginatedExams({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                }));
            }

            toast.success('Exams loaded successfully!');
        } catch (error) {
            console.log("ALL EXAMS API ERROR............", error.message);
            toast.error(error.message || 'Failed to load exams.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // Set loading to false
        }
    };
};