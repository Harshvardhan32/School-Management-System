import toast from "react-hot-toast";
import { classEndPoints } from "../apis";
import apiConnector from "../apiConnect";
import { setLoading, setAllClasses } from "../../slices/classSlice";

const {
    CREATE_CLASS_API,
    UPDATE_CLASS_API,
    DELETE_CLASS_API,
    ALL_CLASSES_API
} = classEndPoints;

export const createClass = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Class...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_CLASS_API,
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
            toast.success('Class Created Successfully!');
            dispatch(getAllClasses(token));
            setOpen(false);
        } catch (error) {
            toast.error("Class Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateClass = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Class...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_CLASS_API,
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
            toast.success('Class Updated Successfully!');
            dispatch(getAllClasses(token));
            setOpen(false);
        } catch (error) {
            toast.error("Class Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteClass = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Class...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_CLASS_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Class Deleted Successfully!');
            dispatch(getAllClasses(token));
            setOpen(false);
        } catch (error) {
            toast.error("Class Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllClasses = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("GET", ALL_CLASSES_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch classes.");
            }

            dispatch(setAllClasses(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}