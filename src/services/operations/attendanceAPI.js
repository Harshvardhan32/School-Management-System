import toast from "react-hot-toast";
import { attendanceEndPoints } from "../apis";
import { setAssignments, setLoading } from "../../slices/assignmentSlice";
import apiConnector from "../apiConnect";

const {
    CREATE_ASSIGNMENT_API,
    UPDATE_ASSIGNMENT_API,
    DELETE_ASSIGNMENT_API,
    ALL_ASSIGNMENTS_API
} = assignmentEndPoints;

export const createAssignment = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_ASSIGNMENT_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE ASSIGNMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Assignment Created Successfully!');
            setOpen(false);
        } catch (error) {
            // console.log("CREATE ASSIGNMENT API ERROR............", error.message);
            toast.error(error?.message || "Assignment Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllAttendance = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        dispatch(setLoading(true)); // Set loading to true
        const toastId = toast.loading('Loading attendance...');
        try {
            // Construct query parameters based on whether we need all data or paginated data
            const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
            const url = `${ALL_ATTENDANCE_API}${queryParams}`;

            // Make the API request
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch attendance.");
            }

            if (allData) {
                // Dispatch non-paginated data to the store
                dispatch(setAttendance(response.data.data));
            } else {
                // Dispatch paginated data to the store
                dispatch(setPaginatedAttendance({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                }));
            }

            toast.success('Attendance loaded successfully!');
        } catch (error) {
            console.log("ALL ATTENDANCE API ERROR............", error.message);
            toast.error(error.message || 'Failed to load attendance.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // Set loading to false
        }
    };
};