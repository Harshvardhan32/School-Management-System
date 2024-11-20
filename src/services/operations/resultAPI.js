import toast from "react-hot-toast";
import { resultEndPoints } from "../apis";
import { setLessons, setLoading } from "../../slices/lessonSlice";
import apiConnector from "../apiConnect";

const {
    CREATE_RESULT_API,
    UPDATE_RESULT_API,
    DELETE_RESULT_API,
    ALL_RESULTS_API
} = resultEndPoints;

export const createLesson = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_LESSON_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE LESSON API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Lesson Created Successfully!');
            setOpen(false);
        } catch (error) {
            // console.log("CREATE LESSON API ERROR............", error.message);
            toast.error(error?.message || "Lesson Creation Failed!");
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

export const getAllResults = (token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await apiConnector("GET", ALL_RESULTS_API, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("ALL CLASSES API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setLessons(response?.data?.data));
        } catch (error) {
            console.log("ALL CLASSES API ERROR............", error.message);
        } finally {
            toast.dismiss(toastId);
        }
    }
}