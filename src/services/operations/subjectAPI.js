import toast from "react-hot-toast";
import { setAllSubjects, setLoading } from "../../slices/subjectSlice";
import { subjectEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    CREATE_SUBJECT_API,
    UPDATE_SUBJECT_API,
    DELETE_SUBJECT_API,
    ALL_SUBJECTS_API
} = subjectEndPoints;

export const createSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_SUBJECT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE SUBJECT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Subject Created Successfully!');
            dispatch(getAllSubjects(token));
            setOpen(false);
        } catch (error) {
            // console.log("CREATE SUBJECT API ERROR............", error.message);
            toast.error("Subject Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_SUBJECT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("UPDATE SUBJECT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Subject Updated Successfully!');
            dispatch(getAllSubjects(token));
            setOpen(false);
        } catch (error) {
            // console.log("UPDATE SUBJECT API ERROR............", error.message);
            toast.error("Subject Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_SUBJECT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("DELETE SUBJECT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Subject Deleted Successfully!');
            dispatch(getAllSubjects(token));
            setOpen(false);
        } catch (error) {
            // console.log("DELETE SUBJECT API ERROR............", error.message);
            toast.error("Subject Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllSubjects = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_SUBJECTS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch subjects.");
            }

            dispatch(setAllSubjects(response?.data.data));
            // toast.success('Subjects loaded successfully!');
        } catch (error) {
            // console.error("Error fetching subjects:", error.message);
            toast.error('Failed to load subjects.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
}