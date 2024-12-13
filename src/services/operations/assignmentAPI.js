import toast from "react-hot-toast";
import { assignmentEndPoints } from "../apis";
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

            console.log("CREATE ASSIGNMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Assignment Created Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("CREATE ASSIGNMENT API ERROR............", error.message);
            toast.error(error?.message || "Assignment Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateAssignment = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_ASSIGNMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("UPDATE ASSIGNMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Assignment Updated Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("UPDATE ASSIGNMENT API ERROR............", error.message);
            toast.error(error?.message || "Assignment Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteAssignment = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_ASSIGNMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("DELETE ASSIGNMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Assignment Deleted Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("DELETE ASSIGNMENT API ERROR............", error.message);
            toast.error(error?.message || "Assignment Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllAssignments = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_ASSIGNMENTS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch assignments.");
            }

            dispatch(setAssignments(response.data.data));

            toast.success('Assignments loaded successfully!');
        } catch (error) {
            console.log("ALL ASSIGNMENT API ERROR............", error.message);
            toast.error(error.message || 'Failed to load assignments.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // Set loading to false
        }
    };
}