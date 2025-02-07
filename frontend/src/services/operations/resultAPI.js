import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { resultEndPoints } from "../apis";
import { setLoading, setResultDetails, setResults } from "../../slices/resultSlice";

const {
    CREATE_RESULT_API,
    UPDATE_RESULT_API,
    DELETE_RESULT_API,
    GET_RESULT_API,
    ALL_RESULTS_API
} = resultEndPoints;

export const createResult = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Creating Result...');

        try {
            const response = await apiConnector("POST", CREATE_RESULT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Result Created Successfully!');
            dispatch(getAllResults(token));
            setOpen(false);
        } catch (error) {
            toast.error("Result Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateResult = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Updating Result...');

        try {
            const response = await apiConnector("PUT", UPDATE_RESULT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Result Updated Successfully!');
            dispatch(getAllResults(token));
            setOpen(false);
        } catch (error) {
            toast.error("Result Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteResult = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Deleting Result...');

        try {
            const response = await apiConnector("DELETE", DELETE_RESULT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Result Deleted Successfully!');
            dispatch(getAllResults(token));
            setOpen(false);
        } catch (error) {
            toast.error("Result Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAResult = (resultId, token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            const url = `${GET_RESULT_API}?resultId=${resultId}`;
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setResultDetails(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export const getAllResults = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

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
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}