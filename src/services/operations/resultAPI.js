import toast from "react-hot-toast";
import { resultEndPoints } from "../apis";
import { setLoading, setResults } from "../../slices/resultSlice";
import apiConnector from "../apiConnect";

const {
    CREATE_RESULT_API,
    UPDATE_RESULT_API,
    DELETE_RESULT_API,
    ALL_RESULTS_API
} = resultEndPoints;

export const createResult = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("POST", CREATE_RESULT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("CREATE RESULT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Result Created Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("CREATE RESULT API ERROR............", error.message);
            toast.error(error?.message || "Result Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateResult = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("PUT", UPDATE_RESULT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("UPDATE RESULT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Result Updated Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("UPDATE RESULT API ERROR............", error.message);
            toast.error(error?.message || "Result Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteResult = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("DELETE", DELETE_RESULT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("DELETE RESULT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Result Deleted Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("DELETE RESULT API ERROR............", error.message);
            toast.error("Result Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllResults = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {

            const response = await apiConnector("GET", ALL_RESULTS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setResults(response?.data?.data));

            toast.success('Results loaded successfully!');
        } catch (error) {
            console.log("ALL RESULTS API ERROR............", error.message);
            toast.error(error.message || 'Failed to load results.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
}