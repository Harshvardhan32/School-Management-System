import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { parentEndPoints } from "../apis";
import { setLoading, setParents } from "../../slices/parentSlice";

const {
    CREATE_PARENT_API,
    UPDATE_PARENT_API,
    DELETE_PARENT_API,
    ALL_PARENTS_API,
} = parentEndPoints;

export const createParent = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("POST", CREATE_PARENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // console.log("CREATE PARENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Parent Created Successfully!');
            dispatch(getAllParents(token));
            setOpen(false);
        } catch (error) {
            // console.log("CREATE PARENT API ERROR............", error.message);
            toast.error('Parent Creation Failed!');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(true));
        }
    }
}

export const updateParent = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("PUT", UPDATE_PARENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // console.log("UPDATE PARENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Parent Updated Successfully!');
            dispatch(getAllParents(token));
            if (data.students) {
                setOpen(false);
            }
        } catch (error) {
            // console.log("UPDATE PARENT API ERROR............", error.message);
            toast.error('Parent Updation Failed!');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(true));
        }
    }
}

export const deleteParent = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("DELETE", DELETE_PARENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // console.log("DELETE PARENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Parent Deleted Successfully!');
            dispatch(getAllParents(token));
            setOpen(false);
        } catch (error) {
            // console.log("DELETE PARENT API ERROR............", error.message);
            toast.error('Parent Deletion Failed!');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(true));
        }
    }
}

export const getAllParents = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_PARENTS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch parents.");
            }

            dispatch(setParents(response?.data?.data));
            // toast.success('Parents loaded successfully!');
        } catch (error) {
            // console.log("ALL PARENTS API ERROR............", error.message);
            toast.error('Failed to load parents.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
}