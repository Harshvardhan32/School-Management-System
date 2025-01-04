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
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_EXAM_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE EXAM API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Exam Created Successfully!');
            dispatch(getAllExams(token));
            setOpen(false);
        } catch (error) {
            // console.log("CREATE EXAM API ERROR............", error.message);
            toast.error("Exam Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateExam = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_EXAM_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("UPDATE EXAM API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Exam Updated Successfully!');
            dispatch(getAllExams(token));
            setOpen(false);
        } catch (error) {
            // console.log("UPDATE EXAM API ERROR............", error.message);
            toast.error("Exam Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteExam = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_EXAM_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("DELETE EXAM API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Exam Deleted Successfully!');
            dispatch(getAllExams(token));
            setOpen(false);
        } catch (error) {
            // console.log("DELETE EXAM API ERROR............", error.message);
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
        const toastId = toast.loading('Loading...');

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
            // toast.success('Exams loaded successfully!');
        } catch (error) {
            // console.log("ALL EXAMS API ERROR............", error.message);
            toast.error('Failed to load exams.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
}