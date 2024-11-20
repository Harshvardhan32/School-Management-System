import toast from "react-hot-toast";
import { setLoading, setExams } from "../../slices/examSlice";
import { examEndPoints } from "../apis";
import apiConnector from "../apiConnect";

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

            console.log("CREATE EXAM API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Exam Created Successfully!');
            setOpen(false);
        } catch (error) {
            // console.log("CREATE EXAM API ERROR............", error.message);
            toast.error(error?.message || "Exam Creation Failed!");
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
            const response = await apiConnector("GET", ALL_EXAMS_API, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("ALL EXAM API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setExams(response?.data?.data));
        } catch (error) {
            // console.log("ALL EXAM API ERROR............", error.message);
            toast.error(error?.message);
        } finally {
            dispatch(setLoading(true));
        }
    }
}