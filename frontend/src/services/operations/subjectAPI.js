import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { subjectEndPoints } from "../apis";
import { setAllSubjects, setLoading } from "../../slices/subjectSlice";

const {
    CREATE_SUBJECT_API,
    UPDATE_SUBJECT_API,
    DELETE_SUBJECT_API,
    ALL_SUBJECTS_API
} = subjectEndPoints;

export const createSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Subject...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_SUBJECT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Subject Created Successfully!');
            dispatch(getAllSubjects(token));
            setOpen(false);
        } catch (error) {
            toast.error("Subject Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Subjetc...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_SUBJECT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Subject Updated Successfully!');
            dispatch(getAllSubjects(token));
            setOpen(false);
        } catch (error) {
            toast.error("Subject Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Subject...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_SUBJECT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Subject Deleted Successfully!');
            dispatch(getAllSubjects(token));
            setOpen(false);
        } catch (error) {
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
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}