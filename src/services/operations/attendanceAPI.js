import toast from "react-hot-toast";
import { attendanceEndPoints } from "../apis";
import { setAssignments, setLoading } from "../../slices/assignmentSlice";
import apiConnector from "../apiConnect";
import { setAttendance } from "../../slices/attendanceSlice";

const {
    CREATE_ATTENDANCE_API,
    UPDATE_ATTENDANCE_API,
    DELETE_ATTENDANCE_API,
    ALL_ATTENDANCE_API
} = attendanceEndPoints;

export const createAttendance = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_ATTENDANCE_API,
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

export const getAllAttendance = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true)); // Set loading to true
        const toastId = toast.loading('Loading...');

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_ATTENDANCE_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch attendance.");
            }

            dispatch(setAttendance(response.data.data));
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