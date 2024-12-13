import toast from "react-hot-toast";
import { lessonEndPoints } from "../apis";
import { setLoading, setAllLessons } from "../../slices/lessonSlice";
import apiConnector from "../apiConnect";

const {
    CREATE_LESSON_API,
    UPDATE_LESSON_API,
    DELETE_LESSON_API,
    ALL_LESSONS_API,
} = lessonEndPoints;

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

            toast.dismiss(toastId);
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

export const updateLesson = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_LESSON_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("UPDATE LESSON API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Lesson Updated Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("UPDATE LESSON API ERROR............", error.message);
            toast.error(error?.message || "Lesson Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteLesson = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_LESSON_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("DELETE LESSON API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Lesson Deleted Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("DELETE LESSON API ERROR............", error.message);
            toast.error(error?.message || "Lesson Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllLessons = (token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_LESSONS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setAllLessons(response.data.data));

            toast.success('Lessons loaded successfully!');
        } catch (error) {
            console.log("ALL LESSONS API ERROR............", error.message);
            toast.error(error.message || 'Failed to load lessons.');
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
};