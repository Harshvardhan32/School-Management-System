import toast from "react-hot-toast";
import { setLoading, setPaginatedStudents, setStudentDetails, setStudents } from "../../slices/studentSlice";
import { studentEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    ALL_STUDENTS_API,
    GET_STUDENT_DETAILS
} = studentEndPoints;

export const getAllStudents = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');
        
        try {
            // Construct the query parameters for either all data or paginated data
            const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
            const url = `${ALL_STUDENTS_API}${queryParams}`;

            // Make the API request
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch students.");
            }

            if (allData) {
                // Dispatch non-paginated data to the store
                dispatch(setStudents(response.data.data));
            } else {
                // Dispatch paginated data to the store
                dispatch(setPaginatedStudents({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                }));
            }

            toast.success('Students loaded successfully!');
        } catch (error) {
            console.log("ALL STUDENTS API ERROR............", error.message);
            toast.error(error.message || 'Failed to load students.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // Set loading to false
        }
    };
};

export const getStudentDetails = (token, studentId) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const url = `${GET_STUDENT_DETAILS}?studentId=${studentId}`;
            const response = await apiConnector("GET", url, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch teachers.");
            }

            dispatch(setStudentDetails(response?.data?.data));
            toast.success('Student details fetched successfully!');
        } catch (error) {
            console.log("STUDENT DETAILS API ERROR............", error?.message);
            toast.error(error?.message || 'Failed to load teacher details.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
};