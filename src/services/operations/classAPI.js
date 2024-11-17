import toast from "react-hot-toast";
import { classEndPoints } from "../apis";
import { setClasses, setLoading } from "../../slices/classSlice";
import apiConnector from "../apiConnect";

const {
    CREATE_CLASS_API,
    UPDATE_CLASS_API,
    DELETE_CLASS_API,
    ALL_CLASSES_API
} = classEndPoints;

export const createClass = (data, token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_CLASS_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE CLASS API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Class Created Successfully!');
        } catch (error) {
            // console.log("CREATE CLASS API ERROR............", error.message);
            toast.error(error?.message || "Class Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateClass = (data, token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", UPDATE_CLASS_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE ANNOUNCEMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Announcement Created Successfully!');
        } catch (error) {
            // console.log("CREATE ANNOUNCEMENT API ERROR............", error.message);
            toast.error(error?.message || "Announcement Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllClasses = (token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await apiConnector("GET", ALL_CLASSES_API, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("ALL CLASSES API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setClasses(response?.data?.data));
        } catch (error) {
            console.log("ALL CLASSES API ERROR............", error.message);
        } finally {
            toast.dismiss(toastId);
        }
    }
}