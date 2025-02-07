import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { assignmentEndPoints } from "../apis";
import { setAssignments, setLoading } from "../../slices/assignmentSlice";

const {
    CREATE_ASSIGNMENT_API,
    UPDATE_ASSIGNMENT_API,
    DELETE_ASSIGNMENT_API,
    ALL_ASSIGNMENTS_API
} = assignmentEndPoints;

export const createAssignment = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Assignment...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_ASSIGNMENT_API,
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
            toast.success('Assignment Created Successfully!');
            dispatch(getAllAssignments(token));
            setOpen(false);
        } catch (error) {
            toast.error("Assignment Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateAssignment = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Assignment...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_ASSIGNMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Assignment Updated Successfully!');
            dispatch(getAllAssignments(token));
            setOpen(false);
        } catch (error) {
            toast.error("Assignment Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteAssignment = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Assignment...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_ASSIGNMENT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Assignment Deleted Successfully!');
            dispatch(getAllAssignments(token));
            setOpen(false);
        } catch (error) {
            toast.error("Assignment Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllAssignments = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

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

            dispatch(setAssignments(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
}