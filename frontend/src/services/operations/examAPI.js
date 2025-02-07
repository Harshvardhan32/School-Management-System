import toast from "react-hot-toast";
import { examEndPoints } from "../apis";
import apiConnector from "../apiConnect";
import { setLoading, setExams } from "../../slices/examSlice";

const {
    CREATE_EXAM_API,
    UPDATE_EXAM_API,
    DELETE_EXAM_API,
    ALL_EXAMS_API,
} = examEndPoints;

export const createExam = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Exam...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_EXAM_API,
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
            toast.success('Exam Created Successfully!');
            dispatch(getAllExams(token));
            setOpen(false);
        } catch (error) {
            toast.error("Exam Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateExam = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Exam...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_EXAM_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Exam Updated Successfully!');
            dispatch(getAllExams(token));
            setOpen(false);
        } catch (error) {
            toast.error("Exam Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteExam = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Exam...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_EXAM_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Exam Deleted Successfully!');
            dispatch(getAllExams(token));
            setOpen(false);
        } catch (error) {
            toast.error("Exam Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllExams = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_EXAMS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch exams.");
            }

            dispatch(setExams(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}