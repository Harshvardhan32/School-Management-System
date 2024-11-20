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

export const getAllAssignment = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", ALL_ASSIGNMENTS_API, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("ALL ASSIGNMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setAssignments(response?.data?.data));
        } catch (error) {
            console.log("ALL ASSIGNMENT API ERROR............", error.message);
            toast.error(error?.message);
        } finally {
            dispatch(setLoading(true));
        }
    }
}