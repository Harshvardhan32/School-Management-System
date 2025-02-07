import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { parentEndPoints } from "../apis";
import { setUser } from "../../slices/profileSlice";
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
        const toastId = toast.loading('Creating Parent...');

        try {
            const response = await apiConnector("POST", CREATE_PARENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Parent Created Successfully!');
            dispatch(getAllParents(token));
            setOpen(false);
        } catch (error) {
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
        const toastId = toast.loading('Updating Parent...');

        try {
            const response = await apiConnector("PUT", UPDATE_PARENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            dispatch(getAllParents(token));

            let user = JSON.parse(localStorage.getItem('auth')).user;
            if (user._id === data.id) {
                dispatch(setUser(response?.data?.data));
                console.log(response?.data?.data);
                console.log(user._id);
            }

            toast.success('Parent Updated Successfully!');
            if (data.students) {
                setOpen(false);
            }
        } catch (error) {
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
        const toastId = toast.loading('Deleting Parent...');

        try {
            const response = await apiConnector("DELETE", DELETE_PARENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Parent Deleted Successfully!');
            dispatch(getAllParents(token));
            setOpen(false);
        } catch (error) {
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
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}