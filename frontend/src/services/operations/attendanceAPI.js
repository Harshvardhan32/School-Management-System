import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { attendanceEndPoints } from "../apis";
import { setLoading, setAttendance } from "../../slices/attendanceSlice";

const {
    CREATE_ATTENDANCE_API,
    UPDATE_ATTENDANCE_API,
    ALL_ATTENDANCE_API
} = attendanceEndPoints;

export const createAttendance = (data, token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Creating Attendance...');

        try {
            const response = await apiConnector("POST", CREATE_ATTENDANCE_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Attendance Created Successfully!');
        } catch (error) {
            toast.error("Attendance Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateAttendance = (data, token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Updating Attendance...');

        try {
            const response = await apiConnector("PUT", UPDATE_ATTENDANCE_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Attendance Updated Successfully!');
        } catch (error) {
            toast.error("Attendance Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllAttendance = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", ALL_ATTENDANCE_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch attendance.");
            }

            dispatch(setAttendance(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}