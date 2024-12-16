import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { attendanceEndPoints } from "../apis";
import { setLoading, setAttendance } from "../../slices/attendanceSlice";

const {
    CREATE_ATTENDANCE_API,
    UPDATE_ATTENDANCE_API,
    DELETE_ATTENDANCE_API,
    ALL_ATTENDANCE_API
} = attendanceEndPoints;

export const createAttendance = (data, token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("POST", CREATE_ATTENDANCE_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("CREATE ATTENDANCE API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Attendance Created Successfully!');
        } catch (error) {
            console.log("CREATE ATTENDANCE API ERROR............", error.message);
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
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("PUT", UPDATE_ATTENDANCE_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("UPDATE ATTENDANCE API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Attendance Updated Successfully!');
        } catch (error) {
            console.log("UPDATE ATTENDANCE API ERROR............", error.message);
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
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("GET", ALL_ATTENDANCE_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch attendance.");
            }

            dispatch(setAttendance(response.data.data));
            toast.success('Attendance loaded successfully!');
        } catch (error) {
            console.log("ALL ATTENDANCE API ERROR............", error.message);
            toast.error('Failed to load attendance.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
}